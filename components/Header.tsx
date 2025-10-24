import React, { useState, useEffect } from 'react';
import { BookOpenIcon, SunIcon, MoonIcon, LogoutIcon } from './icons';

interface HeaderProps {
    currentUser: string | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDarkMode(!isDarkMode);
  };

  const formatDisplayName = (email: string | null): string => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    // Capitalize first letter of each part separated by a dot, underscore, or hyphen
    return namePart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  const displayName = formatDisplayName(currentUser);

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">AI Study Buddy</h1>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
                <span className="text-gray-800 dark:text-gray-200 hidden sm:block">
                    Welcome, <span className="font-semibold">{displayName}</span>!
                </span>
            )}
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            {currentUser && (
                <button
                    onClick={onLogout}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-red-500"
                    aria-label="Logout"
                >
                    <LogoutIcon className="h-6 w-6" />
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;