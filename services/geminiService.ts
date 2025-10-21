import { GoogleGenAI, Chat, GenerateContentResponse, Type } from '@google/genai';
import { InterviewScore } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const baseSystemInstruction = `You are an experienced technical interviewer for a senior software engineer role. 
Your goal is to assess the candidate's skills and experience.
- Start by introducing yourself and setting the agenda for the interview.
- Ask a mix of behavioral and technical questions.
- Ask follow-up questions to probe deeper into their answers.
- Keep your questions and responses concise.
- Be friendly and encouraging.
- Do not ask for personal information.
- After a few questions, conclude the interview and thank the candidate.`;

// Helper to convert File to a GoogleGenerativeAI.Part
function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string; } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string)?.split(',')[1];
      if (base64) {
        resolve({
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function startInterview(resumeContext?: { text: string; skills: string[] }): Chat {
  let finalSystemInstruction = baseSystemInstruction;
  if (resumeContext && (resumeContext.text || resumeContext.skills.length > 0)) {
    finalSystemInstruction += `\n\nIMPORTANT: You have the candidate's resume information. Personalize the interview by asking 1-2 questions specifically based on their skills and experience.`;
    if (resumeContext.skills.length > 0) {
        finalSystemInstruction += `\n- Key skills identified: ${resumeContext.skills.join(', ')}. Ask about their experience with some of these.`;
    }
    if (resumeContext.text) {
        finalSystemInstruction += `\n- Full resume text for context:\n---RESUME START---\n${resumeContext.text}\n---RESUME END---`;
    }
  }

  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: finalSystemInstruction,
    },
  });
  return chat;
}

export async function sendMessage(chat: Chat, message: string): Promise<string> {
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I'm sorry, I encountered an error. Could you please rephrase your answer?";
  }
}

export async function analyzeResume(file: File): Promise<{text: string, skills: string[]}> {
  try {
    const pdfPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            { text: `Extract the full text content from the provided PDF document. Then, analyze the extracted text, which is a resume, and identify the key technical skills. Focus on programming languages, frameworks, libraries, databases, and other relevant technologies. Return the full extracted text and the list of skills in JSON format.` },
            pdfPart,
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedText: {
              type: Type.STRING,
              description: "The full text extracted from the resume PDF."
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A technical skill extracted from the resume."
              }
            }
          },
          required: ["extractedText", "skills"]
        },
      },
    });

    const json = JSON.parse(response.text);
    return { text: json.extractedText || '', skills: json.skills || [] };
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume with AI.');
  }
}

export async function getInterviewScore(chat: Chat): Promise<InterviewScore> {
    try {
        const history = await chat.getHistory();
        // Filter out the initial system instruction and format the conversation
        const conversation = history
            .filter(h => h.role !== 'system' && h.parts.every(p => p.text && p.text.trim() !== ''))
            .map(h => `${h.role === 'user' ? 'Candidate' : 'Interviewer'}: ${h.parts.map(p => p.text).join('')}`)
            .join('\n');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the following interview transcript, please evaluate the candidate's performance. Provide a score from 0 to 100 for each of the following categories: Communication, Technical Knowledge, and Problem Solving. Also provide an overall score (average of the three). Finally, provide constructive feedback including a brief summary, a list of strengths, areas for improvement, and specific, actionable learning recommendations (with reasons) for topics or technologies the candidate should focus on.
            \n\nTranscript:\n${conversation}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        communication: { type: Type.INTEGER, description: "Score for communication skills (0-100)." },
                        technicalKnowledge: { type: Type.INTEGER, description: "Score for technical knowledge (0-100)." },
                        problemSolving: { type: Type.INTEGER, description: "Score for problem-solving abilities (0-100)." },
                        overallScore: { type: Type.INTEGER, description: "Overall score, average of the others." },
                        feedback: { type: Type.STRING, description: "A summary paragraph of feedback for the candidate." },
                        strengths: {
                           type: Type.ARRAY,
                           items: { type: Type.STRING },
                           description: "List of candidate's strengths."
                        },
                        areasForImprovement: {
                           type: Type.ARRAY,
                           items: { type: Type.STRING },
                           description: "List of areas where the candidate can improve."
                        },
                        learningRecommendations: {
                           type: Type.ARRAY,
                           items: {
                               type: Type.OBJECT,
                               properties: {
                                   topic: { type: Type.STRING, description: "A specific topic or technology to learn."},
                                   reason: { type: Type.STRING, description: "Why the candidate should learn this."}
                               },
                               required: ["topic", "reason"]
                           },
                           description: "Actionable learning recommendations."
                        }
                    },
                    required: ["communication", "technicalKnowledge", "problemSolving", "overallScore", "feedback", "strengths", "areasForImprovement", "learningRecommendations"]
                }
            }
        });

        const json = JSON.parse(response.text);
        return json as InterviewScore;
    } catch (error) {
        console.error('Interview scoring error:', error);
        throw new Error('Failed to score interview.');
    }
}
