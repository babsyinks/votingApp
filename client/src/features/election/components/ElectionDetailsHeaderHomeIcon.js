import { useNavigate } from "react-router-dom";
import useBreakpoint from "../../../hooks/useBreakpoint";

const ElectionDetailsHeaderHomeIcon = () => {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  return (
    <>
      <i className={`fas fa-home ${breakpoint === "mobile" ? "fa-2x" : ""}`} onClick={() => navigate("/")}></i>
    </>
  );
};

export default ElectionDetailsHeaderHomeIcon;
