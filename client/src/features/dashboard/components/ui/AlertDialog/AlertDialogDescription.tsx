import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { descriptionBaseStyles } from "./alertDialogStyles";
import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const AlertDialogDescription = createPrimitiveComponent({
  primitive: AlertDialogPrimitive.Description,
  baseClass: descriptionBaseStyles,
});
