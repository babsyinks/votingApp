import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { buttonVariants } from "@/features/dashboard/components/ui/Button";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const AlertDialogAction = createPrimitiveComponent({
  primitive: AlertDialogPrimitive.Action,
  baseClass: buttonVariants(),
});
