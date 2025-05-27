import Block from "../../../components/ui/Block";
import Heading from "../../../components/ui/Heading";
import ElectionDetailsHeader from "./ElectionDetailsHeader";

const ElectionDetailsNoData = () => {
  return (
    <>
      <ElectionDetailsHeader message={"Please come back later."} />
      <Block className="py-10 w-full">
        <Heading type="h2" className="ta-center">
          There Is Currently No Election Or Election Data Could Not Be Fetched.
        </Heading>
      </Block>
    </>
  );
};

export default ElectionDetailsNoData;
