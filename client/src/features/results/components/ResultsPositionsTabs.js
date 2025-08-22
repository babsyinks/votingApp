import Block from "components/ui/Block";
import ResultsPositionsTab from "./ResultsPositionsTab";

export default function ResultsPositionsTabs({
  result,
  currentIndex,
  setCurrentIndex,
}) {
  return (
    <Block type="flex-horz" className="flex-wrap">
      {result.map((res, i) => {
        return (
          <ResultsPositionsTab
            position={res.position}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            tabIndex={i}
            key={i}
          />
        );
      })}
    </Block>
  );
}
