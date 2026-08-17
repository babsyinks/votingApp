import { createSlotComponent } from "./utils/createSlotComponent";

export const SidebarMenuSubButton = createSlotComponent(
  "button",
  "flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent",
  "SidebarMenuSubButton",
);
