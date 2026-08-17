import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

const baseTitleStyles = "mb-1 font-medium leading-none tracking-tight";

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn(baseTitleStyles, className)} {...props} />
));

AlertTitle.displayName = "AlertTitle";
