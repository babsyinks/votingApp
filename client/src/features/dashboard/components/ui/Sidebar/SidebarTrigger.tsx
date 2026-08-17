import * as React from "react";

import { Button } from "../Button";
import { useSidebar } from "./context";

export function SidebarTrigger(props: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return <Button {...props} onClick={toggleSidebar} />;
}
