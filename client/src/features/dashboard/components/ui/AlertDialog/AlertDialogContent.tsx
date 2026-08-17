import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

import { AlertDialogOverlay } from "./AlertDialogOverlay";
import { AlertDialogPortal } from "./AlertDialogPortal";
import { contentBaseStyles } from "./alertDialogStyles";

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(contentBaseStyles, className)}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
