import React from 'react';
import ReactMarkdown from 'react-markdown';

interface RightSidebarProps {
  summary: string | { error: string };
  isLoadingSummary: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ summary, isLoadingSummary }) => {
  return (
    <div className="h-full bg-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversation Summary</h2>
      {isLoadingSummary ? (
        <p>Generating summary...</p>
      ) : typeof summary === 'object' && 'error' in summary ? (
        <p className="text-red-500">{summary.error}</p>
      ) : (
        <ReactMarkdown className="prose max-w-none">
          {typeof summary === 'string' ? summary : ''}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default RightSidebar;
