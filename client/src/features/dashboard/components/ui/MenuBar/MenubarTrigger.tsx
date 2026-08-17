import * as MenubarPrimitive from "@radix-ui/react-menubar";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const MenubarTrigger = createPrimitiveComponent({
  primitive: MenubarPrimitive.Trigger,
  baseClass:
    "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium " +
    "outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground " +
    "focus:bg-accent focus:text-accent-foreground",
  displayName: "MenubarTrigger",
});
