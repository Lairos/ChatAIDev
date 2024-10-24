# AI Chat Interface

This project is a modern chat interface that integrates with an AI backend for intelligent conversations and summarization.

## Key Features

1. **Chat Interface**: A user-friendly interface for conversing with an AI.
2. **Multiple Chat Sessions**: Users can create, switch between, and manage multiple chat sessions.
3. **Message Editing**: Users can edit their messages after sending.
4. **Message Regeneration**: The ability to regenerate AI responses.
5. **Chat Summary**: An AI-generated summary of the conversation displayed in the right sidebar.
6. **Responsive Design**: The interface adapts to different screen sizes, with collapsible sidebars on mobile.

## Project Structure

- `app/`: Main application directory
  - `components/`: React components
    - `ChatInterface.tsx`: Main component orchestrating the chat interface
    - `ChatArea.tsx`: Component for displaying chat messages and input
    - `LeftSidebar.tsx`: Component for chat session management
    - `RightSidebar.tsx`: Component for displaying chat summaries
    - `InputArea.tsx`: Component for message input
  - `lib/`: Utility functions and types
    - `api.ts`: API communication functions
    - `types.ts`: TypeScript type definitions
  - `hooks/`: Custom React hooks
  - `api/`: API route handlers for Next.js

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env` file:
   ```
   API_URL=<Your API URL>
   ORGUUID=<Your Organization UUID>
   APPUUID=<Your Application UUID>
   APPKEY=<Your App Key>
   APPSECRET=<Your App Secret>
   ```
4. Run the development server: `npm run dev`

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS

## API Integration

This project integrates with an external AI API for chat functionality and summarization. The API endpoints and authentication details are managed through environment variables.

## Deployment

This is a Next.js project, which can be easily deployed on platforms like Vercel or Netlify. Make sure to set up the environment variables in your deployment platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Specify your license here]
