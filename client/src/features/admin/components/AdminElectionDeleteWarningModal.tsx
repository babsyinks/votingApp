import React from "react";
import Block from "components/ui/Block";
import Modal from "components/modal/Modal";

export interface AdminElectionDeleteWarningModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteElection: () => Promise<void>;
}

/**
 * AdminElectionDeleteWarningModal component.
 *
 * Renders a confirmation modal when deleting an election.
 * 
 * @param props - Component props
 * @returns The rendered AdminElectionDeleteWarningModal component.
 */
const AdminElectionDeleteWarningModal: React.FC<AdminElectionDeleteWarningModalProps> = ({
  openModal,
  setOpenModal,
  deleteElection,
}) => {
  const message =
    "Election Result And Timer Will Be Deleted. Are You Sure You Want To Proceed?";

  return (
    <Block>
      {openModal && (
        <Modal
          message={message}
          positiveBtnTxt="Yes"
          negativeBtnTxt="No"
          positiveHandler={deleteElection}
          negativeHandler={() => setOpenModal(false)}
        />
      )}
    </Block>
  );
};

export default AdminElectionDeleteWarningModal;
