import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

const baseDescriptionStyles = "text-sm [&_p]:leading-relaxed";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(baseDescriptionStyles, className)} {...props} />
));

AlertDescription.displayName = "AlertDescription";
