import React from "react";
import Heading from "components/ui/Heading";

export interface AuthHeadingProps {
  children: React.ReactNode;
}

/**
 * A styled heading used in authentication screens.
 *
 * @param props - Component props
 * @returns A heading element
 */
export default function AuthHeading({ children }: AuthHeadingProps): JSX.Element {
  return (
    <Heading type="h1" className="text-2xl lh-2r fw-600 ta-center">
      {children}
    </Heading>
  );
}
