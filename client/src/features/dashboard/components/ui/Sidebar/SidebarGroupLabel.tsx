import { createSlotComponent } from "./utils/createSlotComponent";

export const SidebarGroupLabel = createSlotComponent(
  "div",
  "flex h-8 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 " +
    "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
  "SidebarGroupLabel",
);
