import { useState } from 'react';
import { ChatSession } from '../lib/types';

interface LeftSidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onEditTitle: (id: string, newTitle: string) => void;
}

export default function LeftSidebar({
  chatSessions,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onEditTitle,
}: LeftSidebarProps) {
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleEditTitle = (id: string) => {
    setEditingTitleId(id);
    setEditingTitle(chatSessions.find(chat => chat.id === id)?.title || '');
  };

  const handleSaveTitle = (id: string) => {
    if (editingTitle.trim()) {
      onEditTitle(id, editingTitle.trim());
    }
    setEditingTitleId(null);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-200"
        >
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chatSessions.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
              chat.id === activeChatId ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div 
                className="flex-grow cursor-pointer"
                onClick={() => onSelectChat(chat.id)}
              >
                {editingTitleId === chat.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveTitle(chat.id)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle(chat.id)}
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-800 mr-2">{chat.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTitle(chat.id);
                      }}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(chat.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
