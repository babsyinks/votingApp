import React, { useState } from "react";
import getSortedResults from "../helpers/getSortedResults";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import ResultsPositionsTabs from "./ResultsPositionsTabs";
import ResultForAllContestants from "./ResultForAllContestants";

function ResultsAll({ result }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sortedResults = getSortedResults(result, currentIndex);
  return (
    <Block>
      <Heading type="h2" className="ff-nanum ta-center text-responsive-1p8">
        Election Results
      </Heading>
      <ResultsPositionsTabs
        result={result}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <ResultForAllContestants sortedResults={sortedResults} />
    </Block>
  );
}

export default ResultsAll;
