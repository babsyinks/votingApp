import React, { ReactNode, forwardRef } from "react";

interface MotionDivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const motion = {
  div: forwardRef<HTMLDivElement, MotionDivProps>(
    ({ children, ...props }, ref) =>
      renderAfterPropTransform(props, children, ref)
  ),
};

const renderAfterPropTransform = (
  props: Omit<MotionDivProps, "children">,
  children: ReactNode,
  ref: React.Ref<HTMLDivElement>
) => {
  const propCopy: Record<string, unknown> = {};

  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      if (key === "className") {
        propCopy[key] = props[key as keyof typeof props];
      } else {
        propCopy[key.toLowerCase()] = props[key as keyof typeof props];
      }
    }
  }

  return (
    <div data-testid="framer-id" ref={ref} {...propCopy}>
      {children}
    </div>
  );
};
