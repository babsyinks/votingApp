import React from "react";

const AccessibleWrapper = ({ children, ...rest }) => {
  const {
    role,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    title,
    onClick,
  } = rest;

  const accessibilityProps = {
    ...(role ? { role } : {}),
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
    ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
    ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
    ...(title ? { title } : {}),
    ...(onClick ? { onClick } : {}),
  };

  if (!React.isValidElement(children)) return null;

  return React.cloneElement(children, accessibilityProps);
};

export default AccessibleWrapper;
