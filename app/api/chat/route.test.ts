import { NextRequest } from 'next/server';
import { POST } from './route';

describe('POST /api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle chat request', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        message: 'Hello',
        chatHistory: [],
      }),
    } as unknown as NextRequest;

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'AI response' } }],
      }),
    });

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(responseData).toEqual({
      response: 'AI response',
    });
  });

  // 添加更多測試用例...
});
