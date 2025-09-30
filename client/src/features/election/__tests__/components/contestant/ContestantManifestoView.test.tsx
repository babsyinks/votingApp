import { render, screen } from "@testing-library/react";
import ContestantManifestoView from "features/election/components/contestant/ContestantManifestoView";
import { ContestantFrameProps } from "features/election/components/contestant/ContestantFrame";
import { ContestantManifestoInfoProps } from "features/election/components/contestant/info/ContestantManifestoInfo";
import { ContestantButtonManifestoProps } from "features/election/components/contestant/buttons/ContestantButtonManifesto";

jest.mock(
  "features/election/components/contestant/ContestantFrame",
  () =>
    ({ children }: ContestantFrameProps) => (
      <div data-testid="contestant-frame">{children}</div>
    ),
);

jest.mock(
  "features/election/components/contestant/info/ContestantManifestoInfo",
  () =>
    ({ manifesto }: ContestantManifestoInfoProps) => (
      <div data-testid="manifesto-info">{manifesto}</div>
    ),
);

jest.mock(
  "features/election/components/contestant/buttons/ContestantButtonManifesto",
  () =>
    ({ manifestoControl }: ContestantButtonManifestoProps) => (
      <button
        data-testid="manifesto-button"
        onClick={() => manifestoControl.setShowManifesto((prev) => !prev)}
      >
        Toggle Manifesto
      </button>
    ),
);

describe("ContestantManifestoView", () => {
  const manifesto = "This is the candidate's manifesto.";
  const mockSetManifestoVisible = jest.fn();
  const manifestoControl = {
    showManifesto: true,
    setShowManifesto: mockSetManifestoVisible,
  };

  it("renders ContestantFrame", () => {
    render(
      <ContestantManifestoView
        manifesto={manifesto}
        manifestoControl={manifestoControl}
      />,
    );
    expect(screen.getByTestId("contestant-frame")).toBeInTheDocument();
  });

  it("renders ContestantManifestoInfo with correct manifesto", () => {
    render(
      <ContestantManifestoView
        manifesto={manifesto}
        manifestoControl={manifestoControl}
      />,
    );
    expect(screen.getByTestId("manifesto-info")).toHaveTextContent(manifesto);
  });

  it("renders ContestantButtonManifesto and responds to click", () => {
    render(
      <ContestantManifestoView
        manifesto={manifesto}
        manifestoControl={manifestoControl}
      />,
    );

    const button = screen.getByTestId("manifesto-button");
    expect(button).toBeInTheDocument();

    button.click();

    expect(mockSetManifestoVisible).toHaveBeenCalledWith(expect.any(Function));
  });
});
