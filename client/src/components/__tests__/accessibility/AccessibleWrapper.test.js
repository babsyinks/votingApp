import React from 'react';
import { render, screen } from '@testing-library/react';
import AccessibleWrapper from 'components/accessibility/AccessibleWrapper';

describe('AccessibleWrapper', () => {
  test('adds role and aria props to child element', () => {
    render(
      <AccessibleWrapper
        role="button"
        ariaLabel="Click me"
        ariaLabelledBy="label-id"
        ariaDescribedBy="desc-id"
        title="Tooltip text"
      >
        <div>Test Element</div>
      </AccessibleWrapper>
    );

    const element = screen.getByText('Test Element');
    expect(element).toHaveAttribute('role', 'button');
    expect(element).toHaveAttribute('aria-label', 'Click me');
    expect(element).toHaveAttribute('aria-labelledby', 'label-id');
    expect(element).toHaveAttribute('aria-describedby', 'desc-id');
    expect(element).toHaveAttribute('title', 'Tooltip text');
  });

  test('renders child without accessibility props when none are passed', () => {
    render(
      <AccessibleWrapper>
        <span>Plain Element</span>
      </AccessibleWrapper>
    );

    const element = screen.getByText('Plain Element');
    expect(element).not.toHaveAttribute('role');
    expect(element).not.toHaveAttribute('aria-label');
    expect(element).not.toHaveAttribute('aria-labelledby');
    expect(element).not.toHaveAttribute('aria-describedby');
    expect(element).not.toHaveAttribute('title');
  });

  test('returns null if children is not a valid React element', () => {
    const { container } = render(<AccessibleWrapper>{null}</AccessibleWrapper>);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  test('preserves existing props on the child', () => {
    render(
      <AccessibleWrapper ariaLabel="New Label">
        <button type="submit">Submit</button>
      </AccessibleWrapper>
    );

    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('type', 'submit');
    expect(element).toHaveAttribute('aria-label', 'New Label');
  });
});
