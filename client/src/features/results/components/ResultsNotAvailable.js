import ResultsNone from "./ResultsNone";

export default function ResultsNotAvailable() {
  const heading = "Election Results Are Not Available";
  const content = `You are seeing this page because you either tried to view results in dry run mode (no timer was scheduled to run)
  or you tried to view results before the election process concluded (countdown timer is still running).`;
  return <ResultsNone heading={heading} content={content} />;
}
