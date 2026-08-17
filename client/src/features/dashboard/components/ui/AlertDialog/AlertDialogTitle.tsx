import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { titleBaseStyles } from "./alertDialogStyles";
import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const AlertDialogTitle = createPrimitiveComponent({
  primitive: AlertDialogPrimitive.Title,
  baseClass: titleBaseStyles,
});
