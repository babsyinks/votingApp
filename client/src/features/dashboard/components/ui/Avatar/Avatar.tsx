import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const Avatar = createPrimitiveComponent({
  primitive: AvatarPrimitive.Root,
  baseClass: "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
});
