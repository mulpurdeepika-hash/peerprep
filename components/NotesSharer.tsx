import React, { useState } from 'react';
import type { StudyGroup, SharedNote } from '../types';
import { PlusIcon, TrashIcon, DocumentTextIcon } from './icons';

interface NotesSharerProps {
  group: StudyGroup;
  currentUser: string;
  notes: SharedNote[];
  onShareNote: (groupId: string, title: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const NotesSharer: React.FC<NotesSharerProps> = ({ group, currentUser, notes, onShareNote, onDeleteNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onShareNote(group.id, title.trim(), content.trim());
      setTitle('');
      setContent('');
      setIsSharing(false);
    }
  };
  
  const formatSenderName = (email: string) => {
      if (email === currentUser) return "You";
      const namePart = email.split('@')[0];
      return namePart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[70vh] max-h-[800px]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2 text-indigo-500" />
            Shared Notes: <span className="ml-2 text-indigo-500">{group.name}</span>
        </h3>
        <button
          onClick={() => setIsSharing(!isSharing)}
          className="flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Share Note
        </button>
      </div>

      {isSharing && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full px-4 py-2 mb-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your notes, links, or code snippets here..."
              className="w-full px-4 py-2 mb-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28"
              required
            />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsSharing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    Share
                </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {notes.length > 0 ? (
          [...notes].sort((a, b) => b.timestamp - a.timestamp).map(note => (
            <div key={note.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{note.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Shared by {formatSenderName(note.sender)} on {new Date(note.timestamp).toLocaleDateString()}
                  </p>
                </div>
                {(note.sender === currentUser) && (
                  <button onClick={() => onDeleteNote(note.id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 pt-10 h-full flex items-center justify-center">
            <p>No notes have been shared in this group yet. <br/> Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSharer;
