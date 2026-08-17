import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

export const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className,
    )}
    {...props}
  />
);
ContextMenuShortcut.displayName = "ContextMenuShortcut";
