import Button from "components/ui/Button";

export default function AuthButton({
  onClick,
  disabled = false,
  className = "",
  children,
}) {
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
