import React from 'react';
import { render, screen } from '@testing-library/react';
import FullScreenLoader from 'components/loaders/FullScreenLoader';
import styles from './FullScreenLoader.module.css';

describe('FullScreenLoader', () => {
  test('renders the loader with accessibility attributes', () => {
    render(<FullScreenLoader />);
    
    const loader = screen.getByRole('status');
    
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('aria-live', 'polite');
    expect(loader).toHaveAttribute('aria-busy', 'true');
  });

  test('displays loading message', () => {
    render(<FullScreenLoader />);
    
    expect(screen.getByText(/Loading your experience/i)).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<FullScreenLoader />);
    
    const overlay = screen.getByRole('status');
    // eslint-disable-next-line testing-library/no-node-access
    const spinner = overlay.querySelector(`.${styles.loaderSpinner}`);
    const text = screen.getByText(/Loading your experience/i);

    expect(overlay).toHaveClass(styles.loaderOverlay);
    expect(spinner).toBeInTheDocument();
    expect(text).toHaveClass(styles.loaderText);
  });
});
