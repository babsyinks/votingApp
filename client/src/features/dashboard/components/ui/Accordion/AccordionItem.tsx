import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

/**
 * Single Accordion section wrapper.
 */
export const AccordionItem = createPrimitiveComponent({
  primitive: AccordionPrimitive.Item,
  baseClass: "border-b",
  displayName: "AccordionItem",
});
