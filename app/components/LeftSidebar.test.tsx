import { render, screen, fireEvent } from '@testing-library/react';
import LeftSidebar from './LeftSidebar';

describe('LeftSidebar', () => {
  it('renders correctly', () => {
    const mockProps = {
      chatSessions: [],
      activeChatId: null,
      onSelectChat: jest.fn(),
      onNewChat: jest.fn(),
    };

    render(<LeftSidebar {...mockProps} />);
    expect(screen.getByText('New Chat')).toBeInTheDocument();
  });

  // Add more tests...
});
