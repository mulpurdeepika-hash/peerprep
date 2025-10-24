
import React, { useState } from 'react';
import type { Quiz, Question, AnswerFeedback } from '../types';

interface PracticeQuizProps {
  quiz: Quiz;
  onCheckAnswers: (answers: (string | null)[]) => void;
  isChecking: boolean;
  results: AnswerFeedback[] | null;
}

const PracticeQuiz: React.FC<PracticeQuizProps> = ({ quiz, onCheckAnswers, isChecking, results }) => {
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(quiz.length).fill(null));

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckAnswers(userAnswers);
  };

  const getResultClasses = (isCorrect: boolean) => {
    return isCorrect 
      ? 'bg-green-100 dark:bg-green-900/50 border-green-500' 
      : 'bg-red-100 dark:bg-red-900/50 border-red-500';
  };

  const renderQuestion = (question: Question, index: number) => {
    const result = results?.[index];
    const isAnswered = userAnswers[index] !== null;
    
    return (
      <div key={index} className={`p-6 border-l-4 rounded-r-lg transition-all duration-300 mb-6 ${result ? getResultClasses(result.isCorrect) : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
        <p className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{index + 1}. {question.question}</p>
        <div className="space-y-3">
          {question.type === 'multiple_choice' && question.options?.map((option, optIndex) => (
            <label key={optIndex} className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={userAnswers[index] === option}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                disabled={!!results}
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
          {question.type === 'true_false' && ['True', 'False'].map((option, optIndex) => (
            <label key={optIndex} className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={userAnswers[index] === option}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                disabled={!!results}
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
          {question.type === 'short_answer' && (
            <input
              type="text"
              value={userAnswers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              placeholder="Your answer..."
              disabled={!!results}
            />
          )}
        </div>
        {result && (
          <div className="mt-4 p-4 rounded-md bg-opacity-50">
            <p className={`font-semibold ${result.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {result.isCorrect ? 'Correct!' : 'Incorrect.'}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{result.feedback}</p>
            {!result.isCorrect && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Correct answer: <strong>{question.answer}</strong></p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Practice Quiz</h3>
      <form onSubmit={handleSubmit}>
        {quiz.map(renderQuestion)}
        {!results && (
          <button
            type="submit"
            disabled={isChecking || userAnswers.some(a => a === null)}
            className="w-full flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-400 disabled:dark:bg-gray-600 transform hover:scale-105 transition-all duration-300"
          >
            {isChecking ? 'Checking...' : 'Check Answers'}
          </button>
        )}
      </form>
    </div>
  );
};

export default PracticeQuiz;
