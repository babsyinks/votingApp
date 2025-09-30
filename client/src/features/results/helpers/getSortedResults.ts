import type { ElectionCategory } from "features/election/types/electionCategoryType";

const getSortedResults = (
  result: ElectionCategory[],
  currentIndex: number,
) => {
  let sortedResults;
  if (result[currentIndex].contestants.length > 1) {
    sortedResults = result[currentIndex].contestants.sort(
      (a, b) => b.votes.length - a.votes.length,
    );
  } else {
    sortedResults = result[currentIndex].contestants;
  }
  return sortedResults;
};

export default getSortedResults;
