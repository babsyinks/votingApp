import Block from "components/ui/Block";
import Button from "components/ui/Button";
function AdminElectionEndButton({ setOpenModal }) {
  return (
    <Block type="flex-horz-fe" className="w-100vw px-10">
      <Button className="p-10 bg-red text-white border-rounded-5 mr-10" onClick={() => setOpenModal(true)}>End This Election</Button>
    </Block>
  );
}

export default AdminElectionEndButton;
