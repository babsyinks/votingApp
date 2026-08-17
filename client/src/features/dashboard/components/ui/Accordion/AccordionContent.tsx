import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

import type { AccordionContentRef, AccordionContentProps } from "./types";

/**
 * Section that reveals when Accordion is expanded.
 */
export const AccordionContent = React.forwardRef<
  AccordionContentRef,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all",
      "data-[state=closed]:animate-accordion-up",
      "data-[state=open]:animate-accordion-down",
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = "AccordionContent";
