import { Command as CommandPrimitive } from "cmdk";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const Command = createPrimitiveComponent({
  primitive: CommandPrimitive,
  displayName: "Command",
  baseClass:
    "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
});
