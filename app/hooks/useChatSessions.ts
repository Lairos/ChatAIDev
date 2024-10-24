import { useState, useEffect } from 'react';
import { ChatSession } from '../lib/types';

export function useChatSessions() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    // Load chat sessions from local storage or API
    const loadedSessions = localStorage.getItem('chatSessions');
    if (loadedSessions) {
      setChatSessions(JSON.parse(loadedSessions));
    }
  }, []);

  useEffect(() => {
    // Save chat sessions to local storage
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const addChatSession = (newSession: ChatSession) => {
    setChatSessions((prevSessions) => [newSession, ...prevSessions]);
  };

  const updateChatSession = (updatedSession: ChatSession) => {
    setChatSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  };

  const deleteChatSession = (sessionId: string) => {
    setChatSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    );
  };

  return {
    chatSessions,
    addChatSession,
    updateChatSession,
    deleteChatSession,
  };
}
