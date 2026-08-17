import { Command as CommandPrimitive } from "cmdk";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const CommandSeparator = createPrimitiveComponent({
  primitive: CommandPrimitive.Separator,
  displayName: "CommandSeparator",
  baseClass: "-mx-1 h-px bg-border",
});
