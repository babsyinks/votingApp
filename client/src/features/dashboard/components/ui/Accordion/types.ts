import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

export type AccordionItemRef = React.ElementRef<typeof AccordionPrimitive.Item>;
export type AccordionItemProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
>;

export type AccordionTriggerRef = React.ElementRef<
  typeof AccordionPrimitive.Trigger
>;
export type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
>;

export type AccordionContentRef = React.ElementRef<
  typeof AccordionPrimitive.Content
>;
export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>;
