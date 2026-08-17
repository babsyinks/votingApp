import { JSX } from "react";

export interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "password" | "email" | "file" | "date" | "time" | "number";
  /**
   * Key used to forcefully reset the input (mainly for file inputs).
   * When this changes, React will re-create the element.
   */
  resetKey?: number;
}

/**
 * BaseInput is a reusable, low-level component that renders an HTML input element.
 * It supports all standard HTML input attributes, ARIA attributes, and event handlers
 * out of the box. Use `resetKey` to force a re-render (useful for file inputs).
 */
export default function BaseInput({
  resetKey,
  className = "",
  style,
  ...rest
}: BaseInputProps): JSX.Element {
  return <input key={resetKey} className={className} style={style} {...rest} />;
}
