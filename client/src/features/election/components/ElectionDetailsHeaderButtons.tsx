import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useOrientation from "hooks/useOrientation";
import { useAxios } from "hooks/useAxios";
import { userNotAuthenticated } from "features/auth/userAuthSlice";
import Block from "components/ui/Block";
import ElectionDetailsHeaderButton from "./ElectionDetailsHeaderButton";
import { BlockProps } from "components/ui/Block";

interface ElectionDetailsHeaderButtonsProps {
  role: string;
}

const ElectionDetailsHeaderButtons: React.FC<
  ElectionDetailsHeaderButtonsProps
> = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { triggerRequest } = useAxios();
  const isPortrait = useOrientation();

  const signOut = async (): Promise<void> => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/api/v1/auth/signout",
      },
    });
    dispatch(userNotAuthenticated());
  };

  const styleToApply: { type: BlockProps["type"]; class: string } = isPortrait
    ? { type: "flex-vert-sb", class: "mb-5" }
    : { type: "flex-horz-sb", class: "mr-5" };

  return (
    <Block type={styleToApply.type}>
      {role === "admin" && (
        <ElectionDetailsHeaderButton
          btnLabel="Admin In"
          onClick={() => navigate("/admin")}
          className={styleToApply.class}
        />
      )}
      <ElectionDetailsHeaderButton btnLabel="Sign Out" onClick={signOut} />
    </Block>
  );
};

export default ElectionDetailsHeaderButtons;
