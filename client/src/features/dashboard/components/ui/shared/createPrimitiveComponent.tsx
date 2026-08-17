import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

type CreatePrimitiveOptions<T extends React.ElementType> = {
  primitive: T;
  displayName?: string;
  baseClass?: string;
};

function hasDisplayName(
  component: unknown,
): component is { displayName?: string } {
  return (
    (typeof component === "function" || typeof component === "object") &&
    component !== null &&
    "displayName" in component
  );
}

/**
 * Creates a DRY wrapper around Radix primitives with consistent className merging & ref forwarding.
 */
export function createPrimitiveComponent<T extends React.ElementType>({
  primitive,
  baseClass = "",
  displayName,
}: CreatePrimitiveOptions<T>) {
  type PrimitiveProps = React.ComponentPropsWithoutRef<T>;
  type PrimitiveRef = React.ElementRef<T>;

  const Comp = React.forwardRef<PrimitiveRef, PrimitiveProps>(
    ({ className, ...props }, ref) =>
      React.createElement(primitive, {
        ref,
        className: cn(baseClass, className),
        ...props,
      }),
  );

  Comp.displayName =
    displayName ||
    (hasDisplayName(primitive) ? primitive.displayName : undefined) ||
    "PrimitiveComponent";

  return Comp;
}
