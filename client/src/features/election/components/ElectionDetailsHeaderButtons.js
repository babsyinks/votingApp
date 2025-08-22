import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useOrientation from "hooks/useOrientation";
import { useAxios } from "hooks/useAxios";
import { userNotAuthenticated } from "features/auth/userAuthSlice";
import Block from "components/ui/Block";
import ElectionDetailsHeaderButton from "./ElectionDetailsHeaderButton";

const ElectionDetailsHeaderButtons = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { triggerRequest } = useAxios();
  const isPortrait = useOrientation();

  const signOut = async () => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/api/v1/auth/signout",
      },
    });
    dispatch(userNotAuthenticated());
  };

  const styleToApply = isPortrait
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
