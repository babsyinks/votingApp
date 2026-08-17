import { createSlotComponent } from "./utils/createSlotComponent";

export const SidebarGroupAction = createSlotComponent(
  "button",
  "absolute right-2 top-2 rounded-md opacity-0 group-hover:opacity-100",
  "SidebarGroupAction",
);
