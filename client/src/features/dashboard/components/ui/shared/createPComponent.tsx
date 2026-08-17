import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

export function createPComponent(displayName: string, baseClass?: string) {
  const Comp = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ className, ...props }, ref) => (
    <p ref={ref} className={cn(baseClass, className)} {...props} />
  ));

  Comp.displayName = displayName;
  return Comp;
}
