import { useSelector } from "react-redux";
import { timerData } from "features/timer/timerSlice";
import ElectionTimerSettingsButton from "./ElectionTimerSettingsButton";
import type { ElectionTimerSettingsButtonPropsBase } from "./ElectionTimerSettingsButton";

export interface ElectionTimerSettingsButtonsProps
  extends ElectionTimerSettingsButtonPropsBase {
  enableDone: boolean;
}

function ElectionTimerSettingsButtons({
  enableDone,
  ...rest
}: ElectionTimerSettingsButtonsProps) {
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
