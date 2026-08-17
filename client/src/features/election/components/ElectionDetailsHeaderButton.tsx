import Button from "components/ui/Button";

export interface ElectionDetailsHeaderButtonProps {
  onClick: () => void;
  btnLabel: string;
  className?: string;
}

const ElectionDetailsHeaderButton: React.FC<ElectionDetailsHeaderButtonProps> = ({
  onClick,
  btnLabel,
  className = "",
}) => {
  return (
    <Button
      onClick={onClick}
      className={`bg-slateblue text-white border-rounded-5 p-10p ${className}`}
    >
      {btnLabel}
    </Button>
  );
};

export default ElectionDetailsHeaderButton;
