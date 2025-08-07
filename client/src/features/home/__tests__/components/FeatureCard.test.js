import React from 'react';
import { render, screen } from '@testing-library/react';
import FeatureCard from 'features/home/components/FeatureCard';

jest.mock('components/ui/Block', () => ({ children, className }) => (
  <div data-testid="block" className={className}>{children}</div>
));
jest.mock('components/ui/Heading', () => ({ children, type, className }) => (
  <h2 data-testid="heading" className={className}>{children}</h2>
));
jest.mock('components/ui/List', () => ({ items, className }) => (
  <ul data-testid="list" className={className}>
    {items.map((item, index) => (
      <li key={index}>{item.content}</li>
    ))}
  </ul>
));

describe('FeatureCard', () => {
  const mockTitle = 'Test Features';
  const mockItems = [
    { id: '1', content: 'Feature A' },
    { id: '2', content: 'Feature B' },
  ];

  it('renders the title inside Heading', () => {
    render(<FeatureCard title={mockTitle} items={mockItems} />);
    expect(screen.getByTestId('heading')).toHaveTextContent(mockTitle);
  });

  it('renders all items inside List', () => {
    render(<FeatureCard title={mockTitle} items={mockItems} />);
    const list = screen.getByTestId('list');
    expect(list).toHaveTextContent('Feature A');
    expect(list).toHaveTextContent('Feature B');
  });

  it('applies the correct classes to Block and Heading', () => {
    render(<FeatureCard title={mockTitle} items={mockItems} />);
    expect(screen.getByTestId('block').className).toContain('bg-white');
    expect(screen.getByTestId('heading').className).toContain('text-2xl');
  });

  it('renders empty list if items prop is empty', () => {
    render(<FeatureCard title={mockTitle} items={[]} />);
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
  });

  it('renders correctly with special characters in title and items', () => {
    const title = '🔥 Hot Features';
    const items = [{ id: '1', content: '🔐 Security' }, { id: '2', content: '⚡ Speed' }];
    render(<FeatureCard title={title} items={items} />);
    expect(screen.getByTestId('heading')).toHaveTextContent(title);
    expect(screen.getByTestId('list')).toHaveTextContent('🔐 Security');
    expect(screen.getByTestId('list')).toHaveTextContent('⚡ Speed');
  });
});
