import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const SidebarRail = createPrimitiveComponent({
  primitive: "div",
  baseClass:
    "absolute inset-y-0 right-0 w-px bg-border group-data-[state=collapsed]:hidden",
  displayName: "SidebarRail",
});
