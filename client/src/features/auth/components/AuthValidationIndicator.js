import React from "react";
import Span from "components/ui/Span";
import I from "components/ui/I";

export default function AuthValidationIndicator({
  label,
  isValid,
  usePresetWidths = true,
}) {
  const labelWidth = usePresetWidths ? "w-90p" : "";
  const iconWidth = usePresetWidths ? "w-10p" : "";
  return (
    <>
      <Span type="inline-block" className={labelWidth}>
        {label}
      </Span>
      <Span type="inline-block" className={`ml-10 text-lg ta-right ${iconWidth}`}>
        <I
          className={`fas ${
            isValid ? "fa-check-circle" : "fa-times-circle"
          } icon`}
        ></I>
      </Span>
    </>
  );
}
