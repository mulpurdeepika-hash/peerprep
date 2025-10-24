
import React, { useState, useRef, useEffect } from 'react';
// FIX: Aliased the imported `Chat` type to `GenAIChat` to avoid a name collision with the `Chat` component.
import type { Chat as GenAIChat } from '@google/genai';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatProps {
  // FIX: Used the aliased `GenAIChat` type to resolve the name collision.
  chatSession: GenAIChat | null;
  topic: string;
}

const Chat: React.FC<ChatProps> = ({ chatSession, topic }) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);
  
  const sendMessage = async () => {
    if (!input.trim() || !chatSession || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setHistory(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const stream = await chatSession.sendMessageStream({ message: currentInput });
        
        let modelResponse = '';
        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }]};
        setHistory(prev => [...prev, modelMessage]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setHistory(prev => {
                const newHistory = [...prev];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage.role === 'model') {
                    lastMessage.parts[0].text = modelResponse;
                }
                return newHistory;
            });
        }
    } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again.' }]};
        setHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[70vh] max-h-[800px]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chat about: <span className="text-blue-600 dark:text-blue-500">{topic}</span></h3>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>}
            <div className={`max-w-md lg:max-w-lg p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
              <MarkdownRenderer content={msg.parts[0].text} />
            </div>
             {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
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
            placeholder="Ask a follow-up question..."
            className="w-full pl-4 pr-12 py-3 text-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-500 transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
