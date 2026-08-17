import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

import { Separator } from "../Separator";

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    className={cn("mx-2 w-auto bg-sidebar-border", className)}
    {...props}
  />
));

SidebarSeparator.displayName = "SidebarSeparator";
