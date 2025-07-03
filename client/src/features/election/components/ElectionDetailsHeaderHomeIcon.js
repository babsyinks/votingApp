import { useNavigate } from "react-router-dom";
import useBreakpoint from "../../../hooks/useBreakpoint";
import I from "components/ui/I";

const ElectionDetailsHeaderHomeIcon = () => {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  return (
    <>
      <I
        className={`fas fa-home ${breakpoint === "mobile" ? "fa-2x" : ""}`}
        onClick={() => navigate("/")}
      ></I>
    </>
  );
};

export default ElectionDetailsHeaderHomeIcon;
