import ResultStatusIndicator from "./ResultStatusIndicator";

export default function ResultStatusIndicatorLoser() {
  return (
    <ResultStatusIndicator
      textColor="text-red-cool"
      indicatorType="fa-times-circle"
      message="Lost the election"
    />
  );
}
