import { Command as CommandPrimitive } from "cmdk";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

const baseClass =
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm " +
  "outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent " +
  "data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50";

export const CommandItem = createPrimitiveComponent({
  primitive: CommandPrimitive.Item,
  displayName: "CommandItem",
  baseClass,
});
