import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSectionMessage from 'features/home/components/HeroSectionMessage';

jest.mock('components/ui/Heading', () => ({ children, type, className }) => (
  <h1 data-testid="heading" className={className}>
    {children}
  </h1>
));

jest.mock('components/ui/Paragraph', () => ({ children, className }) => (
  <p data-testid="paragraph" className={className}>
    {children}
  </p>
));

describe('HeroSectionMessage', () => {
  it('renders the heading with correct text and class', () => {
    render(<HeroSectionMessage />);
    const heading = screen.getByTestId('heading');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Welcome to VoteNow');
    expect(heading.className).toContain('text-4xl');
    expect(heading.className).toContain('fw-700');
    expect(heading.className).toContain('ta-left');
  });

  it('renders the paragraph with correct text and class', () => {
    render(<HeroSectionMessage />);
    const paragraph = screen.getByTestId('paragraph');

    expect(paragraph).toBeInTheDocument();
    expect(paragraph.textContent).toContain('Your secure and reliable online voting platform');
    expect(paragraph.className).toContain('text-xl');
    expect(paragraph.className).toContain('text-grey-dark');
  });
});
