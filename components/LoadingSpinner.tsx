
import React from 'react';

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
