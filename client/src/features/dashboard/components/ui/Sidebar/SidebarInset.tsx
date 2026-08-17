import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const SidebarInset = createPrimitiveComponent({
  primitive: "div",
  baseClass: "relative flex min-h-screen flex-1 flex-col bg-background",
  displayName: "SidebarInset",
});
