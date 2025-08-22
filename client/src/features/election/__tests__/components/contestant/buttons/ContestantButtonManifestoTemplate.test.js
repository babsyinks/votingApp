import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContestantButtonManifestoTemplate from 'features/election/components/contestant/buttons/ContestantButtonManifestoTemplate';

describe('ContestantButtonManifestoTemplate', () => {
  it('renders children content inside the button', () => {
    render(
      <ContestantButtonManifestoTemplate>
        Read Manifesto
      </ContestantButtonManifestoTemplate>
    );

    expect(screen.getByRole('button', { name: /read manifesto/i })).toBeInTheDocument();
  });

  it('calls handler function on button click', () => {
    const handleClick = jest.fn();

    render(
      <ContestantButtonManifestoTemplate handler={handleClick}>
        Click Me
      </ContestantButtonManifestoTemplate>
    );

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies additional className to button', () => {
    render(
      <ContestantButtonManifestoTemplate className="custom-class">
        Custom
      </ContestantButtonManifestoTemplate>
    );

    const button = screen.getByRole('button', { name: /custom/i });
    expect(button.className).toMatch(/custom-class/);
    expect(button.className).toMatch(/rnd-corner-btn/);
  });

  it('applies inline styles to button', () => {
    const style = { backgroundColor: 'red' };

    render(
      <ContestantButtonManifestoTemplate style={style}>
        Styled
      </ContestantButtonManifestoTemplate>
    );

    const button = screen.getByRole('button', { name: /styled/i });
    expect(button).toHaveStyle('background-color: red');
  });
});
