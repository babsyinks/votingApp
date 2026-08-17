import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cn } from "features/dashboard/lib/utils";
import { ChevronRight } from "lucide-react";
import * as React from "react";

export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none " +
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent " +
        "focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground " +
        "shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out z-50",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;
