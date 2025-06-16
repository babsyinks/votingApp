import React from "react";
import Block from "components/ui/Block";
import Modal from "components/modal/Modal";

function AdminElectionEndWarningModal({ openModal, setOpenModal, endElection }) {
  const message =
    "Election Result And Timer Will Be Deleted. Are You Sure You Want To Proceed?";

  return (
    <Block>
      {openModal && (
        <Modal
          message={message}
          positiveBtnTxt="Yes"
          negativeBtnTxt="No"
          positiveHandler={endElection}
          negativeHandler={() => setOpenModal(false)}
        />
      )}
    </Block>
  );
}

export default AdminElectionEndWarningModal;
