import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { buttonVariants } from "@/features/dashboard/components/ui/Button";
import { cn } from "features/dashboard/lib/utils";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const AlertDialogCancel = createPrimitiveComponent({
  primitive: AlertDialogPrimitive.Cancel,
  baseClass: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0"),
});
