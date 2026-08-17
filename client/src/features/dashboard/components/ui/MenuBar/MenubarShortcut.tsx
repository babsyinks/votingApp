import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

export const MenubarShortcut = ({
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

MenubarShortcut.displayName = "MenubarShortcut";
