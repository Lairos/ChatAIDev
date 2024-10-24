const CHAT_API_URL = process.env.API_URL || '';
const SUMMARY_API_URL = 'https://alpha-api.momentx.ai/v1/app/ai?slot_uuid=c9c92716-455d-41cb-9b72-8feca62f98d2';
const HEADERS = {
  'Content-Type': 'application/json',
  'ORGUUID': process.env.ORGUUID || '',
  'APPUUID': process.env.APPUUID || '',
  'APPKEY': process.env.APPKEY || '',
  'APPSECRET': process.env.APPSECRET || ''
};

export async function sendMessage(message: string, chatHistory: { role: string; content: string }[]) {
  console.log('Sending message to API:', message);
  console.log('Chat history:', chatHistory);
  console.log('API URL:', CHAT_API_URL);
  console.log('Headers:', HEADERS);

  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        messages: [
          ...chatHistory,
          { role: 'user', content: message }
        ],
        temperature: 0,
        top_p: 0,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        max_tokens: 1000,
        stop: "stop_token",
        stream: false
      })
    });

    console.log('API response status:', response.status);
    console.log('API response headers:', response.headers);

    if (!response.ok) {
      console.error('API response not OK:', response.statusText);
      throw new Error('Failed to get AI response');
    }

    const result = await response.text();
    console.log('Full API response:', result);

    try {
      const data = JSON.parse(result);
      console.log('Parsed API response:', data);
      
      // 從新的 JSON 結構中提取 AI 的回應
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Unexpected API response structure');
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return result; // 如果無法解析為 JSON，則返回原始字符串
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

export async function generateSummary(chatHistory: { role: string; content: string }[]) {
  console.log('Generating summary for chat history:', chatHistory);

  try {
    const response = await fetch(SUMMARY_API_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Please summarize the following conversation in Markdown format. Include a brief overview, key points, and any important conclusions or action items." },
          ...chatHistory
        ],
        temperature: 0,
        top_p: 0,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        max_tokens: 1000,
        stop: "stop_token",
        stream: false
      })
    });

    console.log('API response status:', response.status);
    console.log('API response headers:', response.headers);

    if (!response.ok) {
      console.error('API response not OK:', response.statusText);
      throw new Error('Failed to generate summary');
    }

    const result = await response.text();
    console.log('Full API response:', result);

    try {
      const data = JSON.parse(result);
      console.log('Parsed API response:', data);
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        console.error('Unexpected API response structure:', data);
        return { error: 'Unexpected API response structure' };
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return { error: 'Failed to parse API response', rawContent: result };
    }
  } catch (error) {
    console.error('Error in generateSummary:', error);
    return { error: 'Failed to generate summary' };
  }
}
