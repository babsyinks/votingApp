import { useSelector } from "react-redux";
import { userInfo } from "features/user/userSlice";
import useOrientation from "hooks/useOrientation";
import Block from "components/ui/Block";
import ElectionDetailsHeaderMessage from "./ElectionDetailsHeaderMessage";
import ElectionDetailsHeaderHomeIcon from "./ElectionDetailsHeaderHomeIcon";
import ElectionDetailsHeaderButtons from "./ElectionDetailsHeaderButtons";

const ElectionDetailsHeader = ({ message }) => {
  const userDetails = useSelector(userInfo);
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
