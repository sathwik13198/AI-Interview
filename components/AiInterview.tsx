import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Message } from '../types';
import { startInterview, sendMessage, getInterviewScore } from '../services/geminiService';
import { Chat } from '@google/genai';
import { Icons } from '../constants';

// For browser compatibility
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const AiInterview: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submissionId');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // --- Initialize Speech Recognition and Synthesis ---
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript || interimTranscript);
    };

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => console.error('Speech recognition error:', event.error);

    recognitionRef.current = recognition;

    // Cleanup speech synthesis on unmount
    return () => {
        window.speechSynthesis.cancel();
    }
  }, []);

  // --- AI Text-to-Speech ---
  useEffect(() => {
    const lastMessage = messages.find(m => m.sender === 'ai' && !m.isTyping && !m.spoken);
    if (lastMessage) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(lastMessage.text);
        window.speechSynthesis.speak(utterance);

        setMessages(prev =>
            prev.map(m => (m.id === lastMessage.id ? { ...m, spoken: true } : m))
        );
    }
  }, [messages]);


  const initializeChat = useCallback(async () => {
    try {
      const submissionDataJSON = submissionId ? localStorage.getItem(submissionId) : null;
      let resumeContext;
      if (submissionDataJSON) {
        const submissionData = JSON.parse(submissionDataJSON);
        resumeContext = {
          text: submissionData.resumeText,
          skills: submissionData.resumeSkills || [],
        };
      } else {
        console.warn("No submission data found, interview will not have resume context.");
      }

      const newChat = startInterview(resumeContext);
      setChat(newChat);

      const firstMessage = await sendMessage(newChat, "Hello, let's start the interview.");
      setMessages([{ id: '1', text: firstMessage, sender: 'ai', spoken: false }]);
    } catch (error) {
      console.error("Failed to initialize interview:", error);
      setMessages([{ id: 'error', text: "Sorry, I'm having trouble connecting. Please refresh the page.", sender: 'ai'}]);
    } finally {
      setIsLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (!submissionId) {
      alert("No submission ID found. Redirecting to start.");
      navigate('/student-dashboard');
    } else {
      initializeChat();
    }
  }, [initializeChat, navigate, submissionId]);

  const handleSend = async () => {
    if (input.trim() === '' || !chat || isLoading || isFinishing) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage, { id: 'typing', text: '', sender: 'ai', isTyping: true }]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessage(chat, currentInput);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponse, sender: 'ai', spoken: false };
      setMessages(prev => [...prev.filter(m => !m.isTyping), aiMessage]);
    } catch(error) {
       console.error("Failed to send message:", error);
       const errorMessage: Message = { id: 'error-send', text: "Sorry, an error occurred. Please try again.", sender: 'ai' };
       setMessages(prev => [...prev.filter(m => !m.isTyping), errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    if (!chat || !submissionId) return;
    window.speechSynthesis.cancel(); // Stop any speaking
    setIsFinishing(true);
    try {
        const scoreData = await getInterviewScore(chat);
        const submissionDataJSON = localStorage.getItem(submissionId);
        if (submissionDataJSON) {
            const submissionData = JSON.parse(submissionDataJSON);
            submissionData.interviewScore = scoreData;
            submissionData.interviewTranscript = messages.filter(m => !m.isTyping); // Save transcript without typing indicators
            localStorage.setItem(submissionId, JSON.stringify(submissionData));
            localStorage.removeItem('currentSubmission'); // Clean up
            navigate(`/results/${submissionId}`);
        } else {
            alert("Could not save interview results. Submission data not found.");
        }
    } catch (error) {
        alert("An error occurred while finishing the interview. Please try again.");
        console.error("Failed to finish interview:", error);
    } finally {
        setIsFinishing(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
        recognitionRef.current?.stop();
    } else {
        window.speechSynthesis.cancel();
        setInput('');
        recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-lg my-8">
      <header className="bg-gray-900 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex-1">
            <h1 className="text-xl font-bold">Step 3: AI Interview</h1>
        </div>
        <div className="flex-1 text-right">
            <button
                onClick={handleFinishInterview}
                disabled={isFinishing || messages.length < 2}
                title={messages.length < 2 ? "Please answer at least one question before finishing." : "Finish Interview and see results"}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center ml-auto"
            >
                {isFinishing ? <Icons.Spinner /> : null}
                {isFinishing ? 'Analyzing...' : 'Finish Interview'}
            </button>
        </div>
      </header>
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><Icons.Chat /></div>}
            <div className={`px-4 py-3 rounded-xl max-w-lg ${
              msg.sender === 'user' ? 'bg-green-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
            }`}>
              {msg.isTyping ? (
                 <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                 </div>
              ) : (
                <p className="text-white whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
            {msg.sender === 'user' && <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><Icons.User /></div>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-900 rounded-b-lg border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-full p-2">
          <button 
            onClick={toggleRecording} 
            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500/50 text-red-500' : 'hover:bg-gray-600 text-gray-400'}`} 
            title={isRecording ? "Stop recording" : "Start recording"}
            disabled={isLoading || isFinishing}
           >
            {isRecording ? <Icons.MicOn /> : <Icons.Mic />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Listening..." : "Type or record your answer..."}
            className="flex-1 bg-transparent px-4 text-white placeholder-gray-400 focus:outline-none"
            disabled={isLoading || isFinishing}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || isFinishing || input.trim() === ''}
            className="bg-blue-600 text-white rounded-full p-2 ml-2 hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading && messages.some(m => m.isTyping) ? <Icons.Spinner/> : <Icons.Send />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInterview;
