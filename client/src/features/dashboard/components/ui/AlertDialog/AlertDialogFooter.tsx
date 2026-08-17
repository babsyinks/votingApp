import { footerBaseStyles } from "./alertDialogStyles";

import { cn } from "@/features/dashboard/lib/utils";

export const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(footerBaseStyles, className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";
