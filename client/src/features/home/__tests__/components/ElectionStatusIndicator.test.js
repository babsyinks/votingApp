import React from 'react';
import { render, screen } from '@testing-library/react';
import ElectionStatusIndicator from 'features/home/components/ElectionStatusIndicator';
import { useSelector } from 'react-redux';
import useCountdownStatus from 'hooks/useCountdownStatus';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('hooks/useCountdownStatus', () => jest.fn());

describe('ElectionStatusIndicator', () => {
  const mockTimer = {
    startDate: '2025-08-01T00:00:00Z',
    endDate: '2025-08-10T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'electionStatus') return 'inActive';
      if (selector.name === 'timerData') return mockTimer;
      return null;
    });
  });

  it('renders nothing if status is "inActive"', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'electionStatus') return 'inActive';
      if (selector.name === 'timerData') return mockTimer;
    });

    const { container } = render(<ElectionStatusIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders correct message and blinking class for "active_election_live"', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'electionStatus') return 'active_election_live';
      if (selector.name === 'timerData') return mockTimer;
    });

    render(<ElectionStatusIndicator />);

    expect(screen.getByText('🟢 Election Is Live')).toBeInTheDocument();
    expect(screen.getByText('🟢 Election Is Live').className).toContain('blink');
  });

  it('renders correct message without blinking for "active_preElectionCountdown"', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'electionStatus') return 'active_preElectionCountdown';
      if (selector.name === 'timerData') return mockTimer;
    });

    render(<ElectionStatusIndicator />);

    const element = screen.getByText('Election Countdown In Progress');
    expect(element).toBeInTheDocument();
    expect(element.className).not.toContain('blink');
  });

  it('renders correct message without blinking for "active_election_ended"', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'electionStatus') return 'active_election_ended';
      if (selector.name === 'timerData') return mockTimer;
    });

    render(<ElectionStatusIndicator />);

    const element = screen.getByText('⚠️ Election Has Ended');
    expect(element).toBeInTheDocument();
    expect(element.className).not.toContain('blink');
  });

  it('calls useCountdownStatus with startDate and endDate', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'electionStatus') return 'active_preElectionCountdown';
      if (selector.name === 'timerData') return mockTimer;
    });

    render(<ElectionStatusIndicator />);

    expect(useCountdownStatus).toHaveBeenCalledWith(mockTimer.startDate);
    expect(useCountdownStatus).toHaveBeenCalledWith(mockTimer.endDate);
  });
});
