import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const Sidebar = createPrimitiveComponent({
  primitive: "aside",
  baseClass:
    "group/sidebar relative flex h-full w-[--sidebar-width] flex-col bg-sidebar " +
    "text-sidebar-foreground data-[state=collapsed]:w-[--sidebar-width-icon]",
  displayName: "Sidebar",
});
