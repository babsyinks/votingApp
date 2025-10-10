import type { BaseInputProps } from "components/ui/BaseInput";

interface TimerLabelWithType {
  label: string;
  type: BaseInputProps["type"];
}

const timerLabelsWithTypes: TimerLabelWithType[] = [
  {
    label: "Election Start Day",
    type: "date",
  },
  {
    label: "Election Start Time",
    type: "time",
  },
  {
    label: "Election End Day",
    type: "date",
  },
  {
    label: "Election End Time",
    type: "time",
  },
];

export default timerLabelsWithTypes;
