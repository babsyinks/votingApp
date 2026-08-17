import { Command as CommandPrimitive } from "cmdk";
import { cn } from "features/dashboard/lib/utils";
import { Search } from "lucide-react";
import * as React from "react";

const baseClass =
  "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none " +
  "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50";

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(baseClass, className)}
      {...props}
    />
  </div>
));

CommandInput.displayName = "CommandInput";
