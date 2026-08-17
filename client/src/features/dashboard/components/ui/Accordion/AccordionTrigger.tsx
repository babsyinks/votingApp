import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "features/dashboard/lib/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import type { AccordionTriggerRef, AccordionTriggerProps } from "./types";

/**
 * Clickable trigger that expands/contracts Accordion content.
 */
export const AccordionTrigger = React.forwardRef<
  AccordionTriggerRef,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
        "[&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";
