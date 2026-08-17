import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { overlayBaseStyles } from "./alertDialogStyles";
import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const AlertDialogOverlay = createPrimitiveComponent({
  primitive: AlertDialogPrimitive.Overlay,
  baseClass: overlayBaseStyles,
});
