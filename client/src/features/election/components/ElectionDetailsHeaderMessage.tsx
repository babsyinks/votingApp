import Block from "components/ui/Block";

export interface ElectionDetailsHeaderMessageProps {
  message: string;
  username: string;
}

const ElectionDetailsHeaderMessage: React.FC<ElectionDetailsHeaderMessageProps> = ({
  message,
  username,
}) => {
  return (
    <Block className="fw-bold fs-italic ta-center ff-cormorant mx-10-my-0">
      Welcome{" "}
      <span className="fw-bold fs-italic ff-merienda tt-cap mx-10-my-0 text-blue">
        {username.toLowerCase()}.
      </span>{" "}
      {message}
    </Block>
  );
};

export default ElectionDetailsHeaderMessage;
