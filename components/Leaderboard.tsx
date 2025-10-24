import React, { useState } from 'react';
import type { UserStats, Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { TrophyIcon, BookOpenIcon, SparklesIcon, ClockIcon, DocumentTextIcon } from './icons';

interface LeaderboardProps {
  currentUserStats: UserStats | null;
  leaderboardData: UserStats[];
  onBackToDashboard: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserStats, leaderboardData, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard'>('stats');
  
  if (!currentUserStats) {
      return <div>Loading stats...</div>;
  }
  
  const userAchievements = ACHIEVEMENTS.filter(ach => currentUserStats.achievements.includes(ach.id));
  
  const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.points - a.points);
  const currentUserRank = sortedLeaderboard.findIndex(user => user.userId === currentUserStats.userId) + 1;

  const TABS_BASE_CLASS = 'w-full py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors';
  const TABS_ACTIVE_CLASS = 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
  const TABS_INACTIVE_CLASS = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700';

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <button onClick={onBackToDashboard} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">&larr; Back to Dashboard</button>
        <div className="flex items-center">
            <TrophyIcon className="w-10 h-10 mr-4 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Leaderboard & Rewards</h1>
        </div>
      </div>
      
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 flex space-x-2">
        <button 
            onClick={() => setActiveTab('stats')}
            className={`${TABS_BASE_CLASS} ${activeTab === 'stats' ? TABS_ACTIVE_CLASS : TABS_INACTIVE_CLASS}`}
        >
            My Stats & Rewards
        </button>
        <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`${TABS_BASE_CLASS} ${activeTab === 'leaderboard' ? TABS_ACTIVE_CLASS : TABS_INACTIVE_CLASS}`}
        >
            Global Leaderboard
        </button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-yellow-500">{currentUserStats.points}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-blue-500">{currentUserStats.guidesCreated}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Guides Created</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-green-500">{currentUserStats.quizzesAced}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes Aced</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-red-500">{currentUserStats.pomodorosCompleted}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pomodoros Done</p>
                    </div>
                </div>
            </div>
            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Achievements</h2>
                {userAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userAchievements.map(ach => (
                            <div key={ach.id} className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                <ach.icon className="w-8 h-8 mr-4 text-yellow-500" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{ach.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{ach.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No achievements unlocked yet. Keep studying!</p>
                )}
            </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Global Leaderboard</h2>
            <div className="space-y-2">
                {sortedLeaderboard.map((user, index) => (
                    <div key={user.userId} className={`flex items-center justify-between p-3 rounded-lg ${user.userId === currentUserStats.userId ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                        <div className="flex items-center">
                            <span className="font-bold text-lg w-8 text-center">{index + 1}</span>
                            <span className="ml-4 font-medium text-gray-800 dark:text-gray-200">{user.userId.split('@')[0]}</span>
                        </div>
                        <span className="font-bold text-yellow-500">{user.points} pts</span>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
