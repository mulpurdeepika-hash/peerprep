import React, { useState } from 'react';
import type { StudyGroup } from '../types';
import { PlusIcon, UsersIcon, SparklesIcon, ClipboardCheckIcon, QuestionMarkCircleIcon, ClockIcon, TrophyIcon } from './icons';

interface DashboardProps {
  currentUser: string;
  groups: StudyGroup[];
  onCreateGroup: (name: string) => void;
  onSelectGroup: (group: StudyGroup) => void;
  onStartSoloStudy: () => void;
  onGoToPlanner: () => void;
  onGoToDoubtAssistant: () => void;
  onGoToPomodoro: () => void;
  onGoToLeaderboard: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ groups, onCreateGroup, onSelectGroup, onStartSoloStudy, onGoToPlanner, onGoToDoubtAssistant, onGoToPomodoro, onGoToLeaderboard }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Solo Study Card */}
            <DashboardCard
              title="Study Solo"
              description="Generate your own study guides and quizzes on any topic."
              buttonText="Start Solo Session"
              onClick={onStartSoloStudy}
              Icon={SparklesIcon}
              color="purple"
            />
            
            {/* AI Doubt Assistant Card */}
            <DashboardCard
              title="AI Doubt Assistant"
              description="Get quick, clear answers to your specific questions on any topic."
              buttonText="Ask a Question"
              onClick={onGoToDoubtAssistant}
              Icon={QuestionMarkCircleIcon}
              color="yellow"
            />

            {/* Task & Goal Planner Card */}
            <DashboardCard
              title="Task & Goal Planner"
              description="Organize your study schedule, set goals, and track your progress."
              buttonText="Open Planner"
              onClick={onGoToPlanner}
              Icon={ClipboardCheckIcon}
              color="green"
            />
            
            {/* Pomodoro Sessions Card */}
            <DashboardCard
              title="Pomodoro Sessions"
              description="Use the Pomodoro Technique to boost focus and productivity."
              buttonText="Start Timer"
              onClick={onGoToPomodoro}
              Icon={ClockIcon}
              color="red"
            />

            {/* Leaderboard & Rewards Card */}
            <DashboardCard
              title="Leaderboard & Rewards"
              description="Track your progress, earn achievements, and see how you rank."
              buttonText="View Leaderboard"
              onClick={onGoToLeaderboard}
              Icon={TrophyIcon}
              color="blue"
            />
        </div>

        {/* Study Groups Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <UsersIcon className="w-8 h-8 mr-3 text-blue-500" />
                    My Study Groups
                </h2>
                 <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="p-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700"
                    aria-label="Create new group"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateGroup} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="New group name..."
                        className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button type="submit" className="mt-2 w-full px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Create Group
                    </button>
                </form>
            )}
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {groups.length > 0 ? (
                    groups.map(group => (
                        <div key={group.id} onClick={() => onSelectGroup(group)} className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{group.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{group.members.length} member(s)</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No groups yet. Create one to get started!</p>
                )}
            </div>
        </div>
    </div>
  );
};

// Sub-component for dashboard cards to reduce repetition
const DashboardCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  Icon: React.FC<{ className?: string }>;
  color: 'purple' | 'yellow' | 'green' | 'red' | 'blue';
}> = ({ title, description, buttonText, onClick, Icon, color }) => {
  const colorClasses = {
    purple: { icon: 'text-purple-500', bg: 'bg-purple-600', hover: 'hover:bg-purple-700', ring: 'focus:ring-purple-500/50' },
    yellow: { icon: 'text-yellow-500', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', ring: 'focus:ring-yellow-500/50' },
    green: { icon: 'text-green-500', bg: 'bg-green-600', hover: 'hover:bg-green-700', ring: 'focus:ring-green-500/50' },
    red: { icon: 'text-red-500', bg: 'bg-red-600', hover: 'hover:bg-red-700', ring: 'focus:ring-red-500/50' },
    blue: { icon: 'text-blue-500', bg: 'bg-blue-600', hover: 'hover:bg-blue-700', ring: 'focus:ring-blue-500/50' },
  };
  const classes = colorClasses[color];

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transform hover:-translate-y-2 transition-transform duration-300">
      <Icon className={`w-16 h-16 ${classes.icon} mb-4`} />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{description}</p>
      <button
        onClick={onClick}
        className={`w-full px-8 py-3 text-lg font-bold text-white ${classes.bg} rounded-xl ${classes.hover} focus:outline-none focus:ring-4 ${classes.ring} transform hover:scale-105 transition-all duration-300`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Dashboard;