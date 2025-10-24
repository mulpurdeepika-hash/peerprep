import React, { useState, useRef, useEffect } from 'react';
import type { StudyGroup, GroupChatMessage } from '../types';
import { SendIcon } from './icons';

interface GroupChatProps {
  group: StudyGroup;
  currentUser: string;
  chatHistory: GroupChatMessage[];
  onSendMessage: (groupId: string, text: string) => void;
}

// A simple avatar component that shows user initials with a unique color
const Avatar: React.FC<{ email: string }> = ({ email }) => {
    const getInitials = (email: string): string => {
        const namePart = email.split('@')[0];
        const parts = namePart.replace(/[._-]/g, ' ').split(' ').filter(Boolean);
        if (parts.length > 1) {
            return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
        }
        if (parts.length > 0 && parts[0].length > 1) {
            return (parts[0].substring(0, 2)).toUpperCase();
        }
        return (email[0] || '').toUpperCase();
    };

    const stringToColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };
    
    const initials = getInitials(email);
    const bgColor = stringToColor(email);

    return (
        <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ backgroundColor: bgColor, filter: 'brightness(0.95)' }}
            title={email}
        >
            {initials}
        </div>
    );
};

const GroupChat: React.FC<GroupChatProps> = ({ group, currentUser, chatHistory, onSendMessage }) => {
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(group.id, input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatSenderName = (email: string) => {
      if (email === currentUser) return "You";
      const namePart = email.split('@')[0];
      return namePart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[70vh] max-h-[800px]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Group Chat: <span className="text-blue-600 dark:text-blue-500">{group.name}</span></h3>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
        {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === currentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar email={msg.sender} />
                <div className={`flex flex-col ${msg.sender === currentUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-1">
                        {formatSenderName(msg.sender)} - {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className={`max-w-md lg:max-w-lg p-3 rounded-2xl shadow-sm ${msg.sender === currentUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                        <p className="leading-snug break-words">{msg.text}</p>
                    </div>
                </div>
          </div>
        ))}
         {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 pt-10 h-full flex items-center justify-center">
                <p>No messages yet. <br/> Start the conversation!</p>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full pl-4 pr-12 py-3 text-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
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

export default GroupChat;
