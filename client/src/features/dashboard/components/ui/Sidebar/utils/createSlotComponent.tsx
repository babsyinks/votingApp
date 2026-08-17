import { Slot } from "@radix-ui/react-slot";
import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

export function createSlotComponent<T extends React.ElementType>(
  defaultElement: T,
  baseClass: string,
  displayName: string,
) {
  type Props = React.ComponentPropsWithoutRef<T> & { asChild?: boolean };

  const Comp = React.forwardRef<HTMLElement, Props>(
    ({ asChild, className, ...props }, ref) => {
      const Element = asChild ? Slot : defaultElement;
      return (
        <Element ref={ref} className={cn(baseClass, className)} {...props} />
      );
    },
  );

  Comp.displayName = displayName;
  return Comp;
}
