import { Command as CommandPrimitive } from "cmdk";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const CommandList = createPrimitiveComponent({
  primitive: CommandPrimitive.List,
  displayName: "CommandList",
  baseClass: "max-h-[300px] overflow-y-auto overflow-x-hidden",
});
