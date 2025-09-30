import ResultsNone from "./ResultsNone";

export default function ResultsRemoved() {
  const heading = "There Is No Election Result";
  const content = `You are seeing this page because the last election results have been deleted. To start a new
election, contact the admin through the help page and request for a new election to be scheduled.`;
  return <ResultsNone heading={heading} content={content} />;
}
