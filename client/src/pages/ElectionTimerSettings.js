import { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userIsAdmin } from "features/auth/userAuthSlice";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import { useToastMessage } from "hooks/useToastMessage";
import ToastMessage from "components/ui/ToastMessage";
import Block from "components/ui/Block";
import ElectionTimerSettingsForm from "features/timer/components/timerSettings/ElectionTimerSettingsForm";
import ElectionTimerSettingsButtons from "features/timer/components/timerSettings/ElectionTimerSettingsButtons";

function ElectionTimerSettings() {
  const [electionSchedule, setElectionSchedule] = useState({
    startDate: 0,
    endDate: 0,
  });
  const [enableDone, setEnableDone] = useState(false);
  const navigate = useNavigate();
  const userAdminAccess = useSelector(userIsAdmin);
  const dispatch = useDispatch();
  const { toast, triggerSuccessToast, triggerFailureToast, toastDetailsSet } =
    useToastMessage();

  useEffect(() => {
    dispatch(fetchThenSetCurrentTimerStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!userAdminAccess) {
      navigate("/");
    }
  }, [userAdminAccess, navigate]);

  return (
    <Block type="flex-vert" className="w-full h-100vh bg-gradient-blueviolet">
      <Block
        type="flex-vert"
        className="w-80p h-70p border-rounded-10 border-1-grey bg-white"
      >
        {toastDetailsSet() && <ToastMessage toast={toast} />}
        <ElectionTimerSettingsForm
          setElectionSchedule={setElectionSchedule}
          setEnableDone={setEnableDone}
          triggerFailureToast={triggerFailureToast}
        />
        <ElectionTimerSettingsButtons
          electionSchedule={electionSchedule}
          enableDone={enableDone}
          setEnableDone={setEnableDone}
          triggerFailureToast={triggerFailureToast}
          triggerSuccessToast={triggerSuccessToast}
        />
      </Block>
    </Block>
  );
}

export default memo(ElectionTimerSettings);
