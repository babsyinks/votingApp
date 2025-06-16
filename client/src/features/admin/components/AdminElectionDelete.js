import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { timerData, setTimerData } from "features/timer/timerSlice";
import ToastMessage from "components/ui/ToastMessage";
import AdminElectionDeleteWarningModal from "./AdminElectionDeleteWarningModal";
import AdminElectionDeleteButton from "./AdminElectionDeleteButton";

function AdminElectionDelete() {
  const [openModal, setOpenModal] = useState(false);
  const timer = useSelector(timerData);
  const dispatch = useDispatch();
  const { response, error, triggerRequest } = useAxios();
  const { toast, triggerSuccessToast, triggerFailureToast, toastDetailsSet } =
    useToastMessage();

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

  const deleteElection = async () => {
    await triggerRequest({
      params: {
        method: "DELETE",
        url: "/election/delete",
      },
    });
  };
  return (
    <>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      {timer.endDate === null && (
        <>
          <AdminElectionDeleteWarningModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            deleteElection={deleteElection}
          />
          <AdminElectionDeleteButton setOpenModal={setOpenModal} />
        </>
      )}
    </>
  );
}

export default AdminElectionDelete;
