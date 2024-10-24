'use client';

import ChatInterface from './components/ChatInterface';
import { useState } from 'react';
import { Message } from '../lib/types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (message: string) => {
    const newMessage: Message = { role: 'user', content: message, timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, chatHistory: messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiMessage: Message = { role: 'assistant', content: data.response, timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}
