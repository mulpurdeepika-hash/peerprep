import React, { useState } from 'react';
import type { StudyGroup } from '../types';
import { PlusIcon, TrashIcon, UsersIcon } from './icons';

interface GroupManagerProps {
  group: StudyGroup;
  currentUser: string;
  onAddMember: (groupId: string, email: string) => void;
  onRemoveMember: (groupId: string, email: string) => void;
}

const GroupManager: React.FC<GroupManagerProps> = ({ group, currentUser, onAddMember, onRemoveMember }) => {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const isOwner = currentUser === group.owner;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberEmail.trim()) {
      onAddMember(group.id, newMemberEmail.trim());
      setNewMemberEmail('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <UsersIcon className="w-7 h-7 mr-3 text-blue-500" />
        Studying in: <span className="ml-2 text-blue-600 dark:text-blue-500">{group.name}</span>
      </h2>
      
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Members ({group.members.length})</h3>
        <div className="flex flex-wrap gap-2">
            {group.members.map(member => (
                <div key={member} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    <span>{member}</span>
                    {isOwner && member !== group.owner && (
                        <button onClick={() => onRemoveMember(group.id, member)} className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
      </div>

      {isOwner && (
        <div>
          <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Add Member</h3>
          <form onSubmit={handleAddMember} className="flex items-center gap-2">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="member@example.com"
              className="flex-grow px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <PlusIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupManager;
