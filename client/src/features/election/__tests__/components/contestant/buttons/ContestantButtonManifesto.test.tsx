import { render, screen, fireEvent } from '@testing-library/react';
import ContestantButtonManifesto from 'features/election/components/contestant/buttons/ContestantButtonManifesto';
import { vi } from 'vitest';

describe('ContestantButtonManifesto', () => {
  it('renders "Read Manifesto" when showManifesto is false', () => {
    const setShowManifesto = vi.fn();

    render(
      <ContestantButtonManifesto
        manifestoControl={{ showManifesto: false, setShowManifesto }}
      />
    );

    const button = screen.getByRole('button', { name: /read manifesto/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toMatch(/swp-col-blv/);
  });

  it('renders "Close Manifesto" when showManifesto is true', () => {
    const setShowManifesto = vi.fn();

    render(
      <ContestantButtonManifesto
        manifestoControl={{ showManifesto: true, setShowManifesto }}
      />
    );

    const button = screen.getByRole('button', { name: /close manifesto/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toMatch(/swp-col-crm/);
    expect(button).toHaveStyle('margin-top: 5px');
  });

  it('calls setShowManifesto(true) when clicking "Read Manifesto"', () => {
    const setShowManifesto = vi.fn();

    render(
      <ContestantButtonManifesto
        manifestoControl={{ showManifesto: false, setShowManifesto }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /read manifesto/i }));
    expect(setShowManifesto).toHaveBeenCalledWith(true);
  });

  it('calls setShowManifesto(false) when clicking "Close Manifesto"', () => {
    const setShowManifesto = vi.fn();

    render(
      <ContestantButtonManifesto
        manifestoControl={{ showManifesto: true, setShowManifesto }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close manifesto/i }));
    expect(setShowManifesto).toHaveBeenCalledWith(false);
  });
});
