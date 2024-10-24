import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json();

    // 確保聊天歷史中不包含系統消息
    let fullChatHistory: Message[] = [
      ...chatHistory.filter(msg => msg.role !== 'system')
    ];

    if (message) {
      fullChatHistory.push({ role: 'user', content: message, timestamp: new Date() });
    }

    const apiUrl = 'http://localhost:1234/v1/chat/completions';
    
    const apiBody = {
      model: "your-model", // 這裡可以根據需要設置模型
      messages: fullChatHistory.map(msg => ({ role: msg.role, content: msg.content })),
      temperature: 0.7,
      max_tokens: -1,
      stream: false
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response format');
    }

    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || 'Failed to get AI response' }, { status: 500 });
  }
}
