import { useAxios } from "hooks/useAxios";
import React, { useState, useEffect } from "react";
import ResultsAll from "features/results/components/ResultsAll";
import ResultsNone from "features/results/components/ResultsNone";

function Results() {
  const [result, setResult] = useState([]);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const { response, triggerRequest } = useAxios();

  useEffect(() => {
    const resultStatus = async () => {
      await triggerRequest({
        params: {
          method: "GET",
          url: "/election/details",
        },
      });
      // "https://votingapp-pmev.onrender.com/election/details",
    };
    resultStatus();
  }, [triggerRequest]);

  useEffect(() => {
    if (response) {
      setResult(response.electionData);
      setResultsLoaded(true);
    }
  }, [response]);

  if (resultsLoaded) {
    if (result.length > 0) return <ResultsAll result={result} />;
    else return <ResultsNone />;
  } else {
    return null;
  }
}

export default Results;
