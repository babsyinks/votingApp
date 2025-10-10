import getSortedResults from "features/results/helpers/getSortedResults";
import type { ElectionCategory } from "features/election/types/electionCategoryType";
import type { ContestantType } from "features/election/types/contestantType";

describe("getSortedResults", () => {
  let result: ElectionCategory[];
  let contestantList: ContestantType[] = [
    {
      contestant_id: "id1",
      votes: ["1", "2", "3"],
      surname: "Adams",
      firstname: "Mark",
      manifesto: "abc",
      picture: "pic.jpg",
    },
    {
      contestant_id: "id2",
      votes: ["4", "5"],
      surname: "Brown",
      firstname: "Lucy",
      manifesto: "def",
      picture: "pic2.jpg",
    },
    {
      contestant_id: "id3",
      votes: ["6"],
      surname: "Clark",
      firstname: "John",
      manifesto: "ghi",
      picture: "pic3.jpg",
    },
  ];
  beforeEach(() => {
    result = [
      {
        position: "President",
        positionVotes: ["1", "2", "3", "4", "5", "6"],
        contestants: contestantList,
      },
    ];
  });
  it("returns contestants sorted by descending vote count when more than one contestant", () => {
    const sorted = getSortedResults(result, 0);
    expect(sorted).toEqual([
      contestantList[0],
      contestantList[1],
      contestantList[2],
    ]);
  });

  it("returns contestants as-is when only one contestant is present", () => {
    result[0].contestants = [contestantList[0]];

    const sorted = getSortedResults(result, 0);
    expect(sorted).toEqual([contestantList[0]]);
  });

  it("handles empty contestants array gracefully", () => {
    result[0].contestants = [];
    const sorted = getSortedResults(result, 0);
    expect(sorted).toEqual([]);
  });
});
