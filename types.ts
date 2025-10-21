export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Example {
  in: string;
  out: string;
  explanation?: string;
}

export interface TestCase {
  input: any[];
  expected: any;
}

export interface Problem {
  id: string;
  title: string;
  prompt: string;
  examples: Example[];
  constraints: string[];
  difficulty: Difficulty;
  initialCode: {
    [language: string]: string;
  };
  testCases: TestCase[];
}

export interface TestResult {
  testCaseId: number;
  passed: boolean;
  output: string;
}

export interface Message {
  id:string;
  text: string;
  sender: 'user' | 'ai';
  isTyping?: boolean;
  spoken?: boolean;
}

export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  questions: string[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  allowedLanguages: string[];
  problemIds: string[];
}

export interface InterviewScore {
  communication: number; // Score out of 100
  technicalKnowledge: number; // Score out of 100
  problemSolving: number; // Score out of 100
  overallScore: number; // Average score
  feedback: string; // Summary paragraph
  strengths: string[];
  areasForImprovement: string[];
  learningRecommendations: {
    topic: string;
    reason: string;
  }[];
}

export interface Submission {
  id: string;
  resumeText: string;
  resumeSkills: string[];
  codingScore: number; // Percentage
  codingResults: TestResult[];
  interviewScore?: InterviewScore;
  interviewTranscript: Message[];
}
