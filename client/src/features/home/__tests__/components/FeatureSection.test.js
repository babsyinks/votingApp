import React from 'react';
import { render, screen } from '@testing-library/react';
import FeatureSection from 'features/home/components/FeatureSection';

jest.mock('features/home/config/featureCardConfig', () => ({
  item1: {
    title: 'Item 1 Title',
    contents: [
      { id: '1', content: 'Item 1 - Content A' },
      { id: '2', content: 'Item 1 - Content B' },
    ],
  },
  item2: {
    title: 'Item 2 Title',
    contents: [
      { id: '3', content: 'Item 2 - Content A' },
      { id: '4', content: 'Item 2 - Content B' },
    ],
  },
}));

jest.mock('layout/Grid', () => ({ children, className }) => (
  <div data-testid="grid" className={className}>
    {children}
  </div>
));

jest.mock('components/ui/Section', () => ({ children, className }) => (
  <section data-testid="section" className={className}>
    {children}
  </section>
));

jest.mock('features/home/components/FeatureCard', () => ({ title, items }) => (
  <div data-testid="feature-card">
    <h2>{title}</h2>
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.content}</li>
      ))}
    </ul>
  </div>
));

describe('FeatureSection', () => {
  it('renders a Section with correct class', () => {
    render(<FeatureSection />);
    const section = screen.getByTestId('section');
    expect(section).toBeInTheDocument();
    expect(section.className).toContain('mxw-960');
    expect(section.className).toContain('py-4r-px-1p5r');
  });

  it('renders a Grid with correct class', () => {
    render(<FeatureSection />);
    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(grid.className).toContain('grid-basic');
  });

  it('renders two FeatureCard components', () => {
    render(<FeatureSection />);
    const featureCards = screen.getAllByTestId('feature-card');
    expect(featureCards).toHaveLength(2);
  });

  it('passes correct props to first FeatureCard', () => {
    render(<FeatureSection />);
    expect(screen.getByText('Item 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Item 1 - Content A')).toBeInTheDocument();
    expect(screen.getByText('Item 1 - Content B')).toBeInTheDocument();
  });

  it('passes correct props to second FeatureCard', () => {
    render(<FeatureSection />);
    expect(screen.getByText('Item 2 Title')).toBeInTheDocument();
    expect(screen.getByText('Item 2 - Content A')).toBeInTheDocument();
    expect(screen.getByText('Item 2 - Content B')).toBeInTheDocument();
  });
});
