import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

export const AvatarFallback = createPrimitiveComponent({
  primitive: AvatarPrimitive.Fallback,
  baseClass:
    "flex h-full w-full items-center justify-center rounded-full bg-muted",
});
