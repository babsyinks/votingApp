import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

export function createDivComponent(displayName: string, baseClass?: string) {
  const Comp = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div ref={ref} className={cn(baseClass, className)} {...props} />
  ));

  Comp.displayName = displayName;
  return Comp;
}
