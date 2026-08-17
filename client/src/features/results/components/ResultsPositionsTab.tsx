import Span from "components/ui/Span";

export interface ResultsPositionsTabProps {
  position: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  tabIndex: number;
}

export default function ResultsPositionsTab({
  position,
  currentIndex,
  setCurrentIndex,
  tabIndex,
}: ResultsPositionsTabProps) {
  const currentTabIndicator = tabIndex === currentIndex ? "bg-red" : "";
  return (
    <Span
      className={`bg-blue-mute text-white fw-bold m-5p p-5p border-rounded-5 text-responsive-1p2 cs-pointer ff-nanum tt-cap ${currentTabIndicator}`}
      onClick={() => {
        setCurrentIndex(tabIndex);
      }}
    >
      {position}
    </Span>
  );
}
