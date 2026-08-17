import { Command as CommandPrimitive } from "cmdk";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

const baseClass =
  "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 " +
  "[&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs " +
  "[&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground";

export const CommandGroup = createPrimitiveComponent({
  primitive: CommandPrimitive.Group,
  displayName: "CommandGroup",
  baseClass,
});
