import { useChat as useVercelChat } from 'ai/react';

export function useChat(options: any) {
  return useVercelChat(options);
}
