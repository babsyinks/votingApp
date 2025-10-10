import ResultStatusIndicator from "./ResultStatusIndicator";

export default function ResultStatusIndicatorWinner() {
  return (
    <ResultStatusIndicator
      textColor="text-green"
      indicatorType="fa-check-circle"
      message="Won the election"
    />
  );
}
