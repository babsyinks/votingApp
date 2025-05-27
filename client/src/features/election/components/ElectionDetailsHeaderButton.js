import Button from "../../../components/ui/Button";

const ElectionDetailsHeaderButton = ({ onClick, btnLabel, className = "" }) => {
  return (
    <Button
      onClick={onClick}
      className={`bg-slateblue text-white border-rounded-5 p-10 ${className}`}
    >
      {btnLabel}
    </Button>
  );
};

export default ElectionDetailsHeaderButton;
