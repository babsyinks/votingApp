import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "app/rootReducer";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { setTimerData } from "features/timer/timerSlice";
import {
  updateElectionStatusFromTimer,
  electionStatus,
} from "features/election/electionSlice";
import ToastMessage from "components/ui/ToastMessage";
import AdminElectionDeleteWarningModal from "./AdminElectionDeleteWarningModal";
import AdminElectionDeleteButton from "./AdminElectionDeleteButton";

/**
 * AdminElectionDelete component.
 *
 * Handles deletion of an election after it has ended,
 * showing warning modal and success/failure toast messages.
 * 
 * @returns The rendered AdminElectionDelete component.
 */
const AdminElectionDelete: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const statusOfElection = useSelector(electionStatus);

  const dispatch = useDispatch<AppDispatch>();

  const { response, error, triggerRequest } = useAxios<{
    message: "success";
  } | null>();
  const { toast, triggerSuccessToast, triggerFailureToast, toastDetailsSet } =
    useToastMessage();

  useEffect(() => {
    if (response) {
      triggerSuccessToast("Election successfully ended!!!");
      dispatch(setTimerData({}));
      dispatch(updateElectionStatusFromTimer({}));
    }
  }, [response, dispatch, triggerSuccessToast]);

  useEffect(() => {
    if (error) {
      triggerFailureToast("Election could not be ended!!!");
    }
  }, [error, triggerFailureToast]);

  const deleteElection = async (): Promise<void> => {
    await triggerRequest({
      params: {
        method: "DELETE",
        url: "/api/v1/election/delete",
      },
    });
  };

  return (
    <>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      {statusOfElection === "active_election_ended" && (
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
};

export default AdminElectionDelete;
