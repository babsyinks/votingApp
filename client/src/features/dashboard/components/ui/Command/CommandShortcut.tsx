import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

export function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

CommandShortcut.displayName = "CommandShortcut";
