
import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { SparklesIcon } from './icons';

interface StudyGuideProps {
  topic: string;
  guide: string;
  onGenerateQuiz: () => void;
  isLoadingQuiz: boolean;
}

const StudyGuide: React.FC<StudyGuideProps> = ({ topic, guide, onGenerateQuiz, isLoadingQuiz }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Study Guide: <span className="text-blue-600 dark:text-blue-500">{topic}</span>
      </h2>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        <MarkdownRenderer content={guide} />
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onGenerateQuiz}
          disabled={isLoadingQuiz}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:bg-gray-400 disabled:dark:bg-gray-600 transform hover:scale-105 transition-all duration-300"
        >
          {isLoadingQuiz ? (
             <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Quiz...
              </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Practice Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudyGuide;
