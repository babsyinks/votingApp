import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

import { useSidebar } from "./context";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left " +
    "text-sm outline-none ring-sidebar-ring transition hover:bg-sidebar-accent " +
    "hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none " +
    "disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium " +
    "data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 " +
    "group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 " +
    "[&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))]",
      },
      size: {
        default: "h-8",
        sm: "h-7 text-xs",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type SidebarMenuButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  };

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    { asChild = false, isActive, tooltip, variant, size, className, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) return button;

    const tooltipProps =
      typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltipProps}
        />
      </Tooltip>
    );
  },
);

SidebarMenuButton.displayName = "SidebarMenuButton";
