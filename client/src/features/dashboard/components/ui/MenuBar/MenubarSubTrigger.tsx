import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cn } from "features/dashboard/lib/utils";
import { ChevronRight } from "lucide-react";
import * as React from "react";

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
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
  </MenubarPrimitive.SubTrigger>
));

MenubarSubTrigger.displayName = "MenubarSubTrigger";
