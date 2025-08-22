import Span from "components/ui/Span";

export default function ResultsPositionsTab({
  position,
  currentIndex,
  setCurrentIndex,
  tabIndex,
}) {
  const currentTabIndicator = tabIndex === currentIndex ? "bg-red" : "";
  return (
    <Span
      className={`bg-blue-mute text-white fw-bold m-5 p-5 border-rounded-5 text-responsive-1p2 cs-pointer ff-nanum tt-cap ${currentTabIndicator}`}
      onClick={() => {
        setCurrentIndex(tabIndex);
      }}
    >
      {position}
    </Span>
  );
}
