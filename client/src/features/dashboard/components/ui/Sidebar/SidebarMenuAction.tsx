import { createSlotComponent } from "./utils/createSlotComponent";

export const SidebarMenuAction = createSlotComponent(
  "button",
  "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100",
  "SidebarMenuAction",
);
