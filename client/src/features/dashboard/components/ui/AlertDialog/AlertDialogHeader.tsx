import { headerBaseStyles } from "./alertDialogStyles";

import { cn } from "@/features/dashboard/lib/utils";

export const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(headerBaseStyles, className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";
