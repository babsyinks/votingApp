import { cn } from "features/dashboard/lib/utils";
import { ChevronRight } from "lucide-react";
import * as React from "react";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export { BreadcrumbSeparator };
