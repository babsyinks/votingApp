import React, { memo } from "react";
import DataToolTip from "components/ui/DataToolTip";
import Button from "components/ui/Button";

const AdminDataToolTipBtn = ({
  data,
  disabled = false,
  className,
  onClick,
  children,
}) => {
  const buttonProps = {
    onClick,
    disabled,
    className: `rnd-btn ${className}`,
  };

  return (
    <DataToolTip
      data={data}
      withAccessibility
      ariaLabel={data}
    >
      <Button {...buttonProps}>{children}</Button>
    </DataToolTip>
  );
};

export default memo(AdminDataToolTipBtn);
