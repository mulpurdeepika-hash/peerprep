import React, { useState } from 'react';
import { BookOpenIcon, GoogleIcon } from './icons';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-shadow duration-300 text-center">
        <BookOpenIcon className="h-16 w-16 text-blue-600 dark:text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome to AI Study Buddy</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to create study guides and collaborate in groups.</p>
        
        {!showEmailInput ? (
          <button
            onClick={() => setShowEmailInput(true)}
            className="w-full flex items-center justify-center px-8 py-3 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <GoogleIcon className="w-6 h-6 mr-3" />
            Sign in with Google
          </button>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Simulating Google Auth. Please enter your email.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-5 py-3 text-lg text-center text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
              aria-label="Your Email"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={!email.trim()}
              className="mt-6 w-full px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;