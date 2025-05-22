import React, { memo } from "react";
import DataToolTip from "../../../components/ui/DataToolTip";
import Button from "../../../components/ui/Button";

const AdminDataToolTipBtn = ({
  data,
  disabled = false,
  custClass,
  onClick,
  children,
}) => {
  const buttonProps = {
    onClick,
    disabled,
    custom: { custClass: `rnd-btn ${custClass}` },
  };

  return (
    <DataToolTip data={data}>
      <Button {...buttonProps}>{children}</Button>
    </DataToolTip>
  );
};

export default memo(AdminDataToolTipBtn);
