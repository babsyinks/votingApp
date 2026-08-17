import { Command as CommandPrimitive } from "cmdk";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const CommandEmpty = createPrimitiveComponent({
  primitive: CommandPrimitive.Empty,
  displayName: "CommandEmpty",
  baseClass: "py-6 text-center text-sm",
});
