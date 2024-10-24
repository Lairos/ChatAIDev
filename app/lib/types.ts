export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  apiSettings: APISettings;
}

export interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface APISettings {
  model: string;
  systemContent: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
}
