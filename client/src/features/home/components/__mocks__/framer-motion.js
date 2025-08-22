import React from "react";

export const motion = {
  div: React.forwardRef(({ children, ...props }, ref) =>
    renderAfterPropTransform(props, children, ref),
  ),
};

const renderAfterPropTransform = (props, children, ref) => {
  const propCopy = {};
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      if (key === "className") {
        propCopy[key] = props[key];
      } else {
        propCopy[key.toLowerCase()] = props[key];
      }
    }
  }
  return (
    <div data-testid="framer-id" ref={ref} {...propCopy}>
      {children}
    </div>
  );
};
