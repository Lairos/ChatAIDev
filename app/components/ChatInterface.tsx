'use client';

import { useState, useEffect } from 'react';
import LeftSidebar from './LeftSidebar';
import ChatArea from './ChatArea';
import RightSidebar from './RightSidebar';
import { ChatSession, Message } from '../lib/types';
import { sendMessage, generateSummary as apiGenerateSummary } from '../lib/api';

interface SummaryData {
  mainTopic?: string;
  keyPoints?: string[];
  actionItems?: string[];
  openQuestions?: string[];
  error?: string;
}

export default function ChatInterface() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [summary, setSummary] = useState<string | { error: string }>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // 從 localStorage 加載聊天記錄
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions));
    }
    const savedActiveChatId = localStorage.getItem('activeChatId');
    if (savedActiveChatId) {
      setActiveChatId(savedActiveChatId);
    }
  }, []);

  // 保存聊天記錄到 localStorage
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // 保存當前活動聊天 ID 到 localStorage
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('activeChatId', activeChatId);
    }
  }, [activeChatId]);

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date(),
    };
    setChatSessions([newChat, ...chatSessions]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (id: string) => {
    setChatSessions(prevSessions => prevSessions.filter(session => session.id !== id));
    if (activeChatId === id) {
      setActiveChatId(chatSessions.length > 1 ? chatSessions[0].id : null);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!activeChatId) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // 更新聊天會話以包含用戶消息
    setChatSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === activeChatId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    );

    const activeSession = chatSessions.find(session => session.id === activeChatId);
    if (!activeSession) return;

    const chatHistory = activeSession.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    try {
      setIsLoading(true);
      const aiResponse = await sendMessage(message, chatHistory);

      const aiMessage: Message = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      // 更新聊天會話以包含 AI 回覆
      setChatSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === activeChatId
            ? { ...session, messages: [...session.messages, aiMessage] }
            : session
        )
      );

      // 生成新的摘要
      await generateSummary([...chatHistory, { role: 'user', content: message }, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // 這裡您可以添加錯誤處理邏輯，例如顯示錯誤消息給用戶
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = async (chatHistory: { role: string; content: string }[]) => {
    console.log('Generating summary for chat history:', chatHistory);
    setIsLoadingSummary(true);
    try {
      const summaryData = await apiGenerateSummary(chatHistory);
      console.log('Received summary:', summaryData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary({ error: 'Failed to generate summary' });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleRegenerateMessage = async (messageIndex: number) => {
    if (!activeChatId) return;

    const activeSession = chatSessions.find(session => session.id === activeChatId);
    if (!activeSession) return;

    // 獲取到 AI 回覆之前的所有消息
    const messages = activeSession.messages.slice(0, messageIndex);
    const chatHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // 使用後一條用戶消息作為新的輸入
    const lastUserMessage = messages[messages.length - 1].content;

    try {
      const aiResponse = await sendMessage(lastUserMessage, chatHistory);

      const newAiMessage: Message = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      // 更新聊天會話，刪除原來的 AI 回覆，添加新的 AI 回覆
      setChatSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === activeChatId
            ? { ...session, messages: [...messages, newAiMessage] }
            : session
        )
      );
    } catch (error) {
      console.error('Error regenerating message:', error);
    }
  };

  const handleEditMessage = (messageIndex: number, newContent: string) => {
    if (!activeChatId) return;

    setChatSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === activeChatId
          ? {
              ...session,
              messages: session.messages.map((msg, index) => 
                index === messageIndex
                  ? { ...msg, content: newContent }
                  : msg
              )
            }
          : session
      )
    );
  };

  const handleEditTitle = (id: string, newTitle: string) => {
    setChatSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === id
          ? { ...session, title: newTitle }
          : session
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className={`${isLeftSidebarOpen ? 'block' : 'hidden'} md:block w-3/10 flex-shrink-0`}>
        <LeftSidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setIsLeftSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onEditTitle={handleEditTitle}
        />
      </div>

      {/* Chat Area */}
      <div className="w-5/10 flex-grow flex flex-col">
        <ChatArea
          chatSession={chatSessions.find(chat => chat.id === activeChatId)}
          onSendMessage={handleSendMessage}
          onRegenerateMessage={handleRegenerateMessage}
          onEditMessage={handleEditMessage}
          onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onEditTitle={handleEditTitle}
          isLoading={isLoading}
          isLoadingSummary={isLoadingSummary}
        />
      </div>

      {/* Right Sidebar */}
      <div className={`${isRightSidebarOpen ? 'block' : 'hidden'} md:block w-2/10 flex-shrink-0`}>
        <RightSidebar summary={summary} isLoadingSummary={isLoadingSummary} />
      </div>
    </div>
  );
}
