import React, { useState, useRef, useEffect } from 'react';
import type { Chat as GenAIChat } from '@google/genai';
import type { ChatMessage } from '../types';
import { SendIcon, QuestionMarkCircleIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';

interface DoubtAssistantProps {
  chatSession: GenAIChat | null;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  onBackToDashboard: () => void;
  isLoading: boolean;
}

const DoubtAssistant: React.FC<DoubtAssistantProps> = ({ chatSession, chatHistory, onSendMessage, onBackToDashboard, isLoading }) => {
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  const handleSendMessage = () => {
    if (!input.trim() || !chatSession || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        <div className="mb-4">
            <button onClick={onBackToDashboard} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">&larr; Back to Dashboard</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col flex-grow h-[calc(100vh-200px)] max-h-[800px]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <QuestionMarkCircleIcon className="w-8 h-8 mr-3 text-yellow-500"/>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Doubt Assistant</h3>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
                {chatHistory.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 pt-10 h-full flex items-center justify-center">
                        <p>Have a question? Ask me anything about your studies!</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0"></div>}
                        <div className={`max-w-md lg:max-w-lg p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <MarkdownRenderer content={msg.parts[0].text} />
                        </div>
                        {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0"></div>
                        <div className="max-w-md p-4 rounded-2xl bg-gray-100 dark:bg-gray-700">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a specific question..."
                        className="w-full pl-4 pr-12 py-3 text-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-500 transition-colors"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DoubtAssistant;
