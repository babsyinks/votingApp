import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useOrientation from "../../../hooks/useOrientation";
import { useAxios } from "../../../hooks/useAxios";
import { userIsAdmin } from "../../auth/userAuthSlice";
import { userNotAuthenticated } from "../../auth/userAuthSlice";
import Block from "../../../components/ui/Block";
import ElectionDetailsHeaderButton from "./ElectionDetailsHeaderButton";

const ElectionDetailsHeaderButtons = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userAdminAccess = useSelector(userIsAdmin);
  // const { setRemoveToken } = useRemoveFromLocalStorage("token");
  const { triggerRequest } = useAxios();
  const isPortrait = useOrientation();

  const accessAdmin = async () => {
    try {
      if (userAdminAccess) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };

  const logOut = async () => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/auth//logout",
      },
    });
    // setRemoveToken(true);
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
          onClick={accessAdmin}
          className={styleToApply.class}
        />
      )}
      <ElectionDetailsHeaderButton btnLabel="Sign Out" onClick={logOut} />
    </Block>
  );
};

export default ElectionDetailsHeaderButtons;
