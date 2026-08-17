import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "features/dashboard/lib/utils";
import * as React from "react";

import { Label } from "../Label";
import { useFormField } from "./useFormField";

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  );
});

FormLabel.displayName = "FormLabel";
