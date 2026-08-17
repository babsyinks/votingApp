import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const SidebarContent = createPrimitiveComponent({
  primitive: "div",
  baseClass:
    "flex min-h-0 flex-1 flex-col gap-2 overflow-auto " +
    "group-data-[collapsible=icon]:overflow-hidden",
  displayName: "SidebarContent",
});
