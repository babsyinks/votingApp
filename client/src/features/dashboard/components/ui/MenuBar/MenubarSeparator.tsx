import * as MenubarPrimitive from "@radix-ui/react-menubar";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const MenubarSeparator = createPrimitiveComponent({
  primitive: MenubarPrimitive.Separator,
  baseClass: "-mx-1 my-1 h-px bg-muted",
  displayName: "MenubarSeparator",
});
