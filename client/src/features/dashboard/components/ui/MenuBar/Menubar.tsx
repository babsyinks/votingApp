import * as MenubarPrimitive from "@radix-ui/react-menubar";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const Menubar = createPrimitiveComponent({
  primitive: MenubarPrimitive.Root,
  baseClass:
    "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
  displayName: "Menubar",
});
