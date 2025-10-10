import { ContestantType } from "features/election/types/contestantType";

export interface GetTieStatus{
  sortedResults: ContestantType[];
  index: number;
  votes: string[];
  highestVote: number;
}

const getTieStatus = ({ sortedResults, index, votes, highestVote }: GetTieStatus) => {
  let isTie = false;
  if (index === 0) {
    if (sortedResults.length > 1) {
      if (sortedResults[index].votes.length === sortedResults[1].votes.length) {
        isTie = true;
      }
    }
  } else if (votes.length === highestVote) {
    isTie = true;
  }
  return isTie;
};

export default getTieStatus;
