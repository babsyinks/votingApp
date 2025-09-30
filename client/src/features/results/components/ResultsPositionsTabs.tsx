import Block from "components/ui/Block";
import ResultsPositionsTab from "./ResultsPositionsTab";
import type { ResultsPositionsTabProps } from "./ResultsPositionsTab";
import type { ElectionCategory } from "features/election/types/electionCategoryType";

export type ResultsPositionsTabsProps = Pick<ResultsPositionsTabProps, "currentIndex" | "setCurrentIndex"> & {
  result: ElectionCategory[];
}

export default function ResultsPositionsTabs({
  result,
  currentIndex,
  setCurrentIndex,
}: ResultsPositionsTabsProps) {
  return (
    <Block type="flex-horz" className="flex-wrap">
      {result.map((res, i) => (
        <ResultsPositionsTab
          position={res.position}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          tabIndex={i}
          key={i}
        />
      ))}
    </Block>
  );
}
