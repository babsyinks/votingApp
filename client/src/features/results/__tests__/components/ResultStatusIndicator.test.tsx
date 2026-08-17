import { render, screen } from '@testing-library/react';
import ResultStatusIndicator from 'features/results/components/ResultStatusIndicator';
import type { BlockProps } from 'components/ui/Block';
import type { SpanProps } from 'components/ui/Span';
import type { IProps } from 'components/ui/I';
import { vi } from 'vitest';

vi.mock('components/ui/Block', () => (props: BlockProps) => <div data-testid="block" {...props} />);
vi.mock('components/ui/Span', () => (props: SpanProps) => <span data-testid="span" {...props} />);
vi.mock('components/ui/I', () => (props: IProps) => <i data-testid="icon" {...props} />);

describe('ResultStatusIndicator', () => {
  it('renders the message text in a Span component', () => {
    render(
      <ResultStatusIndicator
        textColor="text-green"
        indicatorType="fa-check-circle"
        message="Won the election"
      />
    );

    const span = screen.getByTestId('span');
    expect(span).toHaveTextContent("Won the election");
    expect(span).toHaveClass('fw-bold', 'ff-nanum', 'mr-5p');
  });

  it('applies the correct text color class to the Block component', () => {
    render(
      <ResultStatusIndicator
        textColor="text-green"
        indicatorType="fa-check-circle"
        message="Won the election"
      />
    );

    const block = screen.getByTestId('block');
    expect(block).toHaveClass('text-green');
  });

  it('renders the icon with the correct classes', () => {
    render(
      <ResultStatusIndicator
        textColor="text-green"
        indicatorType="fa-check-circle"
        message="Won the election"
      />
    );

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('far', 'fa-check-circle', 'fa-lg');
  });

  it('renders all three parts: Block, Span, and I', () => {
    render(
      <ResultStatusIndicator
        textColor="text-green"
        indicatorType="fa-check-circle"
        message="Won the election"
      />
    );

    expect(screen.getByTestId('block')).toBeInTheDocument();
    expect(screen.getByTestId('span')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
