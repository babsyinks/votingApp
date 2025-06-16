import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { timerData, setTimerData } from "features/timer/timerSlice";
import AdminElectionEndWarningModal from "./AdminElectionEndWarningModal";
import AdminElectionEndButton from "./AdminElectionEndButton";

function AdminElectionEnd() {
  const [openModal, setOpenModal] = useState(false);
  const timer = useSelector(timerData);
  const dispatch = useDispatch();
  const { response, error, triggerRequest } = useAxios();
  const { triggerSuccessToast, triggerFailureToast } = useToastMessage();

  useEffect(() => {
    if (response) {
      triggerSuccessToast("Election successfully ended!!!");
      dispatch(setTimerData({}));
    }
  }, [response, dispatch, triggerSuccessToast]);

  useEffect(() => {
    if (error) {
      triggerFailureToast("Election could not be ended!!!");
    }
  }, [error, triggerFailureToast]);

  const endElection = async () => {
    await triggerRequest({
      params: {
        method: "DELETE",
        url: "/election/delete",
      },
    });
  };
  return (
    timer.endDate === null && (
      <>
        <AdminElectionEndWarningModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          endElection={endElection}
        />
        <AdminElectionEndButton setOpenModal={setOpenModal} />
      </>
    )
  );
}

export default AdminElectionEnd;
