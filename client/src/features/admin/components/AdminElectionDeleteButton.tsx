import React from "react";
import Block from "components/ui/Block";
import Button from "components/ui/Button";

export interface AdminElectionDeleteButtonProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * AdminElectionDeleteButton component.
 * 
 * Renders a button that opens the election delete confirmation modal.
 * 
 * @param props - Component props
 * @returns The rendered AdminElectionDeleteButton component.
 */
const AdminElectionDeleteButton: React.FC<AdminElectionDeleteButtonProps> = ({
  setOpenModal,
}) => {
  return (
    <Block type="flex-horz-fe" className="w-100vw px-10-py-0">
      <Button
        className="p-10 bg-red text-white border-rounded-5 mr-10"
        onClick={() => setOpenModal(true)}
      >
        Delete This Election
      </Button>
    </Block>
  );
};

export default AdminElectionDeleteButton;
