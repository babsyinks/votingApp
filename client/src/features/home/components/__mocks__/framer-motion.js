import React from "react";

export const motion = {
  div: React.forwardRef(({ children, ...props }, ref) => (
    <div data-testid="mini-feature-card" ref={ref} {...props}>
      {children}
    </div>
  )),
};
