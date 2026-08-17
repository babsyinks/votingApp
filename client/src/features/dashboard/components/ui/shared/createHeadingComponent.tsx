import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

export function createHeadingComponent<
  T extends keyof JSX.IntrinsicElements = "h3",
>(as: T, displayName: string, baseClass?: string) {
  const Comp = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) =>
      React.createElement(as, {
        ref,
        className: cn(baseClass, className),
        ...props,
      }),
  );

  Comp.displayName = displayName;
  return Comp;
}
