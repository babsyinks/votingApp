import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setTimerData } from "../../timerSlice";
import { useAxios } from "../../../../hooks/useAxios";
import useResponsiveFontSize from "../../hooks/useResponsiveFontSize";
import Button from "../../../../components/ui/Button";

function ElectionTimerSettingsButton({
  label,
  className,
  electionSchedule,
  setEnableDone,
  triggerSuccessToast,
  triggerFailureToast,
}) {
  const dispatch = useDispatch();
  const { response, error, triggerRequest } = useAxios();

  const isSetTimer = label === "Set Timer";
  const msg = useMemo(() => (isSetTimer ? "Set!" : "Cancelled!"), [isSetTimer]);
  const fontSize = useResponsiveFontSize();

  useEffect(() => {
    if (response) {
      const { startDate, endDate } = response;
      dispatch(setTimerData({ startDate, endDate }));
      triggerSuccessToast(`Timer Successfully ${msg}`);
      setEnableDone(false);
    }
  }, [dispatch, response, triggerSuccessToast, msg, setEnableDone]);

  useEffect(() => {
    if (error) {
      triggerFailureToast(`Timer Could Not Be ${msg}`);
      setEnableDone(false);
    }
  }, [error, triggerFailureToast, msg, setEnableDone]);

  const setTimer = async () => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/timer/set",
        data: electionSchedule,
      },
    });
  };

  const cancelTimer = async () => {
    await triggerRequest({
      params: {
        method: "GET",
        url: "/timer/cancel",
      },
    });
  };

  const clickHandler = isSetTimer ? setTimer : cancelTimer;

  return (
    <Button
      className={`rect-btn m-10 ${fontSize} ${className}`}
      onClick={clickHandler}
    >
      {label}
    </Button>
  );
}

export default ElectionTimerSettingsButton;
