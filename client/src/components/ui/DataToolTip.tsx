import { ReactNode, JSX, HTMLAttributes } from "react";
import "./DataToolTip.css";

export interface DataToolTipProps extends HTMLAttributes<HTMLDivElement> {
  /** The text to show inside the tooltip. */
  data: string;
  /** The child content over which the tooltip appears. */
  children: ReactNode;
}

/**
 * A component that renders a tooltip using a `data-tooltip` attribute.
 *
 * Accessibility:
 * - Any valid HTML `<div>` attribute (e.g., `role`, `aria-*`, `title`, etc.)
 *   can be passed directly via props.
 *
 * Styling:
 * - Uses a `data-tooltip` attribute combined with CSS in `DataToolTip.css`.
 *
 * @returns The rendered tooltip component.
 */
export default function DataToolTip({
  data,
  children,
  ...rest
}: DataToolTipProps): JSX.Element {
  return (
    <div data-tooltip={data} {...rest} data-testid="data-tooltip-id" >
      {children}
    </div>
  );
}
