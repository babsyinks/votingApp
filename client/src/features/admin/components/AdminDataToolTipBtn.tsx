import React, { memo, ReactNode, MouseEventHandler } from "react";
import DataToolTip from "components/ui/DataToolTip";
import Button from "components/ui/Button";

export interface AdminDataToolTipBtnProps {
  data: string;
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

/**
 * A button component that shows a tooltip with the provided data.
 *
 * @param props - Component props
 * @returns The rendered AdminDataToolTipBtn component.
 */
const AdminDataToolTipBtn: React.FC<AdminDataToolTipBtnProps> = ({
  data,
  disabled = false,
  className = "",
  onClick,
  children,
}) => {
  const buttonProps = {
    onClick,
    disabled,
    className: `rnd-btn ${className}`,
  };

  return (
    <DataToolTip data={data} aria-label={data}>
      <Button {...buttonProps}>{children}</Button>
    </DataToolTip>
  );
};

export default memo(AdminDataToolTipBtn);
