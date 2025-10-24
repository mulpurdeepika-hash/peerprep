import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon, ClockIcon } from './icons';

interface PomodoroTimerProps {
  onBackToDashboard: () => void;
  onSessionComplete: () => void;
}

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onBackToDashboard, onSessionComplete }) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A simple chime sound, loaded once.
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (audioRef.current) {
        audioRef.current.play();
      }
      if (mode === 'work') {
        onSessionComplete(); // Notify parent that a work session was completed
        setMode('break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('work');
        setTimeLeft(WORK_TIME);
      }
      setIsActive(false); 
    }
  }, [timeLeft, mode, onSessionComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const progress = (mode === 'work' ? (WORK_TIME - timeLeft) / WORK_TIME : (BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center">
        <div className="w-full mb-4">
            <button onClick={onBackToDashboard} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">&larr; Back to Dashboard</button>
        </div>
        <div className={`w-full p-8 rounded-2xl shadow-2xl transition-colors duration-500 ${mode === 'work' ? 'bg-red-50 dark:bg-gray-800' : 'bg-green-50 dark:bg-gray-800'}`}>
            <div className="text-center mb-6 flex items-center justify-center">
                <ClockIcon className={`w-8 h-8 mr-3 ${mode === 'work' ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`px-4 py-1 rounded-full text-lg font-semibold ${mode === 'work' ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200'}`}>
                    {mode === 'work' ? 'Focus Session' : 'Break Time'}
                </span>
            </div>
            <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200 dark:text-gray-700" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        className={`transition-all duration-1000 ${mode === 'work' ? 'text-red-500' : 'text-green-500'}`}
                        strokeWidth="7"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (progress / 100) * 283}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-gray-800 dark:text-gray-100 select-none">{formatTime(timeLeft)}</span>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-6">
                <button onClick={resetTimer} className="p-4 rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" aria-label="Reset Timer">
                    <ArrowPathIcon className="w-7 h-7"/>
                </button>
                <button 
                    onClick={toggleTimer} 
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : (mode === 'work' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600')}`}
                    aria-label={isActive ? 'Pause Timer' : 'Start Timer'}
                >
                    {isActive ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12 pl-1" />}
                </button>
                 <button onClick={() => {
                     setIsActive(false);
                     const newMode = mode === 'work' ? 'break' : 'work';
                     setMode(newMode);
                     setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
                 }} className="p-4 rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" aria-label="Skip to next session">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653zm12.75 0v12.694l-7.01-4.032c-.728-.417-.728-1.521 0-1.938l7.01-4.032z" clipRule="evenodd" /></svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default PomodoroTimer;