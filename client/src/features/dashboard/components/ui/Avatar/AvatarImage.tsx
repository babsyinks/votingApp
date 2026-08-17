import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const AvatarImage = createPrimitiveComponent({
  primitive: AvatarPrimitive.Image,
  baseClass: "aspect-square h-full w-full",
});
