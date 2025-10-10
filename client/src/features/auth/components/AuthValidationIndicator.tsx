import React from "react";
import Span from "components/ui/Span";
import I from "components/ui/I";

export interface AuthValidationIndicatorProps {
  /** The label text to display */
  label: React.ReactNode;
  /** Whether the validation is valid or not */
  isValid: boolean;
  /** Whether to use preset widths for layout */
  usePresetWidths?: boolean;
}

/**
 * A small indicator component showing a label and a check/times icon
 * depending on whether something is valid.
 */
export default function AuthValidationIndicator({
  label,
  isValid,
  usePresetWidths = true,
}: AuthValidationIndicatorProps): JSX.Element {
  const labelWidth = usePresetWidths ? "w-90p" : "";
  const iconWidth = usePresetWidths ? "w-10p" : "";

  return (
    <>
      <Span type="inline-block" className={labelWidth}>
        {label}
      </Span>
      <Span type="inline-block" className={`ml-10 text-lg ta-right ${iconWidth}`}>
        <I
          className={`fas ${isValid ? "fa-check-circle" : "fa-times-circle"} icon`}
        />
      </Span>
    </>
  );
}
