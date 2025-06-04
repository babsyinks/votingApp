import { useSelector } from "react-redux";
import { timerData } from "../timerSlice";
import ElectionTimerSettingsButton from "./ElectionTimerSettingsButton";

function ElectionTimerSettingsButtons({ enableDone, ...rest }) {
  const timer = useSelector(timerData);

  return (
    <>
      {enableDone && (
        <ElectionTimerSettingsButton
          label="Set Timer"
          className="pst-btn"
          {...rest}
        />
      )}
      {(timer.startDate || timer.endDate) && (
        <ElectionTimerSettingsButton
          label="Cancel Timer"
          className="neg-btn"
          {...rest}
        />
      )}
    </>
  );
}

export default ElectionTimerSettingsButtons;
