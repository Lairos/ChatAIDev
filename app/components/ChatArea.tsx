import { useState, useEffect } from 'react';
import { ChatSession, Message } from '../lib/types';
import InputArea from './InputArea';

interface ChatAreaProps {
  chatSession: ChatSession | undefined;
  onSendMessage: (message: string) => void;
  onRegenerateMessage: (messageIndex: number) => void;
  onEditMessage: (messageIndex: number, newContent: string) => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onEditTitle: (id: string, newTitle: string) => void;
  isLoading: boolean;
  isLoadingSummary: boolean;
}

export default function ChatArea({ 
  chatSession, 
  onSendMessage, 
  onRegenerateMessage,
  onEditMessage,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onEditTitle,
  isLoading,
  isLoadingSummary
}: ChatAreaProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    if (chatSession) {
      setEditingTitle(chatSession.title);
    }
  }, [chatSession]);

  const handleSendMessage = async (message: string) => {
    await onSendMessage(message);
  };

  const handleRegenerate = async (index: number) => {
    setRegeneratingIndex(index);
    await onRegenerateMessage(index);
    setRegeneratingIndex(null);
  };

  const handleEditTitle = () => {
    if (chatSession && editingTitle.trim()) {
      onEditTitle(chatSession.id, editingTitle.trim());
      setIsEditingTitle(false);
    }
  };

  if (!chatSession) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat or start a new one</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onToggleLeftSidebar} className="md:hidden mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isEditingTitle ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleEditTitle}
              onKeyPress={(e) => e.key === 'Enter' && handleEditTitle()}
              className="text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1"
              autoFocus
            />
          ) : (
            <h2 className="text-lg font-semibold">{chatSession?.title}</h2>
          )}
          <button
            onClick={() => setIsEditingTitle(!isEditingTitle)}
            className="ml-2 text-gray-500 hover:text-blue-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <button onClick={onToggleRightSidebar} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatSession.messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            message={message} 
            index={index}
            onRegenerate={handleRegenerate}
            onEdit={onEditMessage}
            isEditing={editingIndex === index}
            isRegenerating={regeneratingIndex === index}
            setEditing={(isEditing) => setEditingIndex(isEditing ? index : null)}
          />
        ))}
        {isLoading && !isLoadingSummary && (
          <div className="flex justify-start">
            <LoadingIndicator />
          </div>
        )}
      </div>
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  index: number;
  onRegenerate: (index: number) => void;
  onEdit: (index: number, newContent: string) => void;
  isEditing: boolean;
  isRegenerating: boolean;
  setEditing: (isEditing: boolean) => void;
}

function MessageBubble({ 
  message, 
  index, 
  onRegenerate, 
  onEdit, 
  isEditing, 
  isRegenerating,
  setEditing 
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = () => {
    onEdit(index, editContent);
    setEditing(false);
  };

  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div className="relative inline-block">
        <div
          className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
            isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded p-2"
            />
          ) : (
            message.content
          )}
        </div>
        {!isUser && (
          <button
            onClick={() => onRegenerate(index)}
            className={`absolute bottom-0 right-0 -mb-5 mr-2 text-xs ${
              isRegenerating ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'
            } transition-colors duration-200 flex items-center`}
            disabled={isRegenerating}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        )}
      </div>
      <div className="flex justify-end items-center mt-6 text-xs text-gray-500">
        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
        {isUser && (
          <button
            onClick={() => setEditing(!isEditing)}
            className={`ml-2 ${
              isEditing ? 'text-red-500 hover:text-red-700' : 'text-blue-500 hover:text-blue-700'
            } transition-colors duration-200 flex items-center`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        )}
        {isEditing && (
          <button
            onClick={handleEdit}
            className="ml-2 text-green-500 hover:text-green-700 transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save
          </button>
        )}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-xs">
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
}
