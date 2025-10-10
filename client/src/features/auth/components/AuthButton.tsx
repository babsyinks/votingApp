import React from "react";
import Button from "components/ui/Button";

export interface AuthButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * A styled button used in authentication flows, with a neumorphic look.
 *
 * @param props - Component props
 * @returns A styled button element
 */
export default function AuthButton({
  onClick,
  disabled = false,
  className = "",
  children,
}: AuthButtonProps): JSX.Element {
  return (
    <Button
      className={`neumorphic-button mb-1r ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
