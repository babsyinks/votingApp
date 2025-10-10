import React from "react";

export interface MainProps extends React.HTMLAttributes<HTMLElement> {
  /** Additional class names. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** Main content to render. */
  children?: React.ReactNode;
}

/**
 * The main component that semantically represents the main content of a page.
 *
 * @returns The rendered <main> element.
 */
export default function Main({
  className = "",
  style = {},
  children,
  ...rest
}: MainProps): JSX.Element {
  return (
    <main className={className} style={style} {...rest}>
      {children}
    </main>
  );
}
