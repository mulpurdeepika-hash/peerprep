import React, { useState } from 'react';
import type { Goal, Task } from '../types';
import { PlusIcon, TrashIcon, ClipboardCheckIcon } from './icons';

interface PlannerProps {
  goals: Goal[];
  tasks: Task[];
  onCreateGoal: (title: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onCreateTask: (goalId: string, text: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onBackToDashboard: () => void;
}

const Planner: React.FC<PlannerProps> = ({
  goals,
  tasks,
  onCreateGoal,
  onDeleteGoal,
  onCreateTask,
  onToggleTask,
  onDeleteTask,
  onBackToDashboard
}) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim()) {
      onCreateGoal(newGoalTitle.trim());
      setNewGoalTitle('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <button onClick={onBackToDashboard} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">&larr; Back to Dashboard</button>
        <div className="flex items-center">
            <ClipboardCheckIcon className="w-10 h-10 mr-4 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Task & Goal Planner</h1>
        </div>
      </div>
      
      {/* Create New Goal Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Add a New Goal</h2>
        <form onSubmit={handleCreateGoal} className="flex items-center gap-2">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="e.g., Learn Advanced CSS"
            className="flex-grow px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            disabled={!newGoalTitle.trim()}
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.length > 0 ? (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              tasks={tasks.filter(t => t.goalId === goal.id)}
              onDeleteGoal={onDeleteGoal}
              onCreateTask={onCreateTask}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <ClipboardCheckIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">No goals yet!</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Add a goal above to start planning your studies.</p>
            </div>
        )}
      </div>
    </div>
  );
};

// --- GoalCard Sub-component ---
interface GoalCardProps {
    goal: Goal;
    tasks: Task[];
    onDeleteGoal: (goalId: string) => void;
    onCreateTask: (goalId: string, text: string) => void;
    onToggleTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, tasks, onDeleteGoal, onCreateTask, onToggleTask, onDeleteTask }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            onCreateTask(goal.id, newTaskText.trim());
            setNewTaskText('');
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{goal.title}</h3>
                <button onClick={() => onDeleteGoal(goal.id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{completedTasks} / {tasks.length} Completed</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 mb-4">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => onToggleTask(task.id)}
                                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className={`ml-3 text-gray-700 dark:text-gray-300 ${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                                {task.text}
                            </span>
                        </label>
                        <button onClick={() => onDeleteTask(task.id)} className="text-gray-400 hover:text-red-500 opacity-50 hover:opacity-100">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Task Form */}
             <form onSubmit={handleCreateTask} className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-grow px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                    type="submit"
                    className="p-2 text-white bg-gray-400 dark:bg-gray-600 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    disabled={!newTaskText.trim()}
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};


export default Planner;