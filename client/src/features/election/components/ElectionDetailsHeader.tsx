import { useSelector } from "react-redux";
import { userInfo } from "features/user/userSlice";
import useOrientation from "hooks/useOrientation";
import Block from "components/ui/Block";
import ElectionDetailsHeaderMessage from "./ElectionDetailsHeaderMessage";
import ElectionDetailsHeaderHomeIcon from "./ElectionDetailsHeaderHomeIcon";
import ElectionDetailsHeaderButtons from "./ElectionDetailsHeaderButtons";

export interface ElectionDetailsHeaderProps {
  message: string;
}

interface UserDetails {
  username: string;
  role: string;
}

const ElectionDetailsHeader: React.FC<ElectionDetailsHeaderProps> = ({ message }) => {
  const userDetails = useSelector(userInfo) as UserDetails;
  const isPortrait = useOrientation();
  const fontSize = isPortrait ? "text-3vh" : "text-2vw";
  const { username, role } = userDetails;

  return (
    <Block
      type="flex-horz-sb"
      className={`border-rounded-5 mx-5-my-0 p-10 opacity-70 bg-white-transparent border-2-grey-light-transparent ${fontSize}`}
    >
      <ElectionDetailsHeaderHomeIcon />
      <ElectionDetailsHeaderMessage message={message} username={username} />
      <ElectionDetailsHeaderButtons role={role} />
    </Block>
  );
};

export default ElectionDetailsHeader;
