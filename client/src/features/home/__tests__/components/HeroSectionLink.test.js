import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSectionLink from 'features/home/components/HeroSectionLink';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('components/ui/Block', () => ({ children, ...props }) => (
  <div data-testid="block" {...props}>
    {children}
  </div>
));

jest.mock('components/ui/Button', () => ({ children, ...props }) => (
  <button data-testid="button" {...props}>
    {children}
  </button>
));

describe('HeroSectionLink', () => {
  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <HeroSectionLink {...props} />
      </MemoryRouter>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders vote button for authenticated users when election is ongoing', () => {
    useSelector.mockReturnValue('active_election_live');

    renderComponent({ userIsAuthenticated: true });

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('Go to Voting Page');
    expect(button.className).toContain('secondary-btn');

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/vote');
  });

  it('renders results button for authenticated users when election ended', () => {
    useSelector.mockReturnValue('active_election_ended');

    renderComponent({ userIsAuthenticated: true });

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('Go to Results Page');
    expect(button.className).toContain('neutral-btn');
    expect(button.className).toContain('bg-grey-mute');

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/results');
  });

  it('renders sign in and sign up buttons for unauthenticated users', () => {
    useSelector.mockReturnValue('active_preElectionCountdown');

    renderComponent({ userIsAuthenticated: false });

    const buttons = screen.getAllByTestId('button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0]).toHaveTextContent('Sign In');
    expect(buttons[0].className).toContain('neutral-btn');
    expect(buttons[0].className).toContain('bg-blueviolet-cool');

    expect(buttons[1]).toHaveTextContent('Sign up');
    expect(buttons[1].className).toContain('primary-btn');

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/signin');
    expect(links[1]).toHaveAttribute('href', '/signup-start');
  });
});
