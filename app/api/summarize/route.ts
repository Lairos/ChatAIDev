import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { chatHistory } = await request.json();

  const apiUrl = 'http://localhost:1234/v1/chat/completions';
  const apiBody = {
    model: "Lewdiculous/L3-8B-Stheno-v3.2-GGUF-IQ-Imatrix",
    messages: [
      { role: "system", content: "Please summarize the chat history in bullet points." },
      { role: "user", content: chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') }
    ],
    temperature: 0.7,
    max_tokens: -1,
    stream: false // 為了簡化處理，我們先不使用流式傳輸
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    // 將摘要轉換為 HTML 格式的項目符號列表
    const summaryHtml = summary.split('\n').map(line => `<li>${line.replace(/^-\s*/, '')}</li>`).join('');

    return NextResponse.json({ summary: `<ul>${summaryHtml}</ul>` });
  } catch (error) {
    console.error('Error calling AI API for summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
