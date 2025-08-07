import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultStatusIndicator from 'features/results/components/ResultStatusIndicator';

jest.mock('components/ui/Block', () => (props) => <div data-testid="block" {...props} />);
jest.mock('components/ui/Span', () => (props) => <span data-testid="span" {...props} />);
jest.mock('components/ui/I', () => (props) => <i data-testid="icon" {...props} />);

describe('ResultStatusIndicator', () => {
  it('renders the message text in a Span component', () => {
    render(
      <ResultStatusIndicator
        textColor="text-blue-500"
        indicatorType="fa-check"
        message="You passed!"
      />
    );

    const span = screen.getByTestId('span');
    expect(span).toHaveTextContent('You passed!');
    expect(span).toHaveClass('fw-bold', 'ff-nanum', 'mr-5');
  });

  it('applies the correct text color class to the Block component', () => {
    render(
      <ResultStatusIndicator
        textColor="text-green-600"
        indicatorType="fa-check"
        message="Success"
      />
    );

    const block = screen.getByTestId('block');
    expect(block).toHaveClass('text-green-600');
  });

  it('renders the icon with the correct classes', () => {
    render(
      <ResultStatusIndicator
        textColor="text-red-600"
        indicatorType="fa-times"
        message="Error"
      />
    );

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('far', 'fa-times', 'fa-lg');
  });

  it('renders all three parts: Block, Span, and I', () => {
    render(
      <ResultStatusIndicator
        textColor="text-gray-700"
        indicatorType="fa-info-circle"
        message="Heads up!"
      />
    );

    expect(screen.getByTestId('block')).toBeInTheDocument();
    expect(screen.getByTestId('span')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
