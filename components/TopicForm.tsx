
import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface TopicFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Unlock Your Learning Potential</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">What topic would you like to master today?</p>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, The Cold War, React Hooks..."
              className="w-full px-5 py-4 text-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="mt-6 w-full flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6 mr-2" />
                Generate Study Guide
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TopicForm;
