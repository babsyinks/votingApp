import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminDataToolTipBtn from 'features/admin/components/AdminDataToolTipBtn';

jest.mock('components/ui/DataToolTip', () => ({ children, data, ariaLabel }) => (
  <div data-testid="tooltip" aria-label={ariaLabel}>
    {children}
  </div>
));

jest.mock('components/ui/Button', () => ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    data-testid="button"
  >
    {children}
  </button>
));

describe('AdminDataToolTipBtn', () => {
  it('renders the button with provided children and data tooltip', () => {
    render(
      <AdminDataToolTipBtn data="Tooltip text">
        Click Me
      </AdminDataToolTipBtn>
    );

    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');

    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('aria-label', 'Tooltip text');
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = jest.fn();

    render(
      <AdminDataToolTipBtn data="Info" onClick={handleClick}>
        Submit
      </AdminDataToolTipBtn>
    );

    const button = screen.getByTestId('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className correctly', () => {
    render(
      <AdminDataToolTipBtn data="Tooltip" className="custom-class">
        Button
      </AdminDataToolTipBtn>
    );

    const button = screen.getByTestId('button');
    expect(button).toHaveClass('rnd-btn');
    expect(button).toHaveClass('custom-class');
  });

  it('disables the button when disabled prop is true', () => {
    render(
      <AdminDataToolTipBtn data="Tooltip" disabled>
        Disabled Button
      </AdminDataToolTipBtn>
    );

    const button = screen.getByTestId('button');
    expect(button).toBeDisabled();
  });
});
