import getTieStatus from "features/results/helpers/getTieStatus";
import type { GetTieStatus } from "features/results/helpers/getTieStatus";

describe("getTieStatus", () => {
  let sortedResults: GetTieStatus["sortedResults"];
  beforeEach(() => {
    sortedResults = [
      {
        contestant_id: "id1",
        votes: ["1", "2"],
        surname: "Adams",
        firstname: "Mark",
        manifesto: "abc",
        picture: "pic.jpg",
      },
      {
        contestant_id: "id2",
        votes: ["3", "4"],
        surname: "Brown",
        firstname: "Lucy",
        manifesto: "def",
        picture: "pic2.jpg",
      },
      {
        contestant_id: "id3",
        votes: ["5"],
        surname: "Clark",
        firstname: "John",
        manifesto: "ghi",
        picture: "pic3.jpg",
      },
    ];
  });
  it("returns true when index is 0 and top two entries have equal vote lengths", () => {
    const result = getTieStatus({
      sortedResults,
      index: 0,
      votes: ["1", "2"],
      highestVote: 2,
    });
    expect(result).toBe(true);
  });

  it("returns false when index is 0 and top two entries have different vote lengths", () => {
    sortedResults[0].votes = ['1', '2', '3']
    sortedResults[1].votes = ['4', '5'] 
    const result = getTieStatus({
      sortedResults,
      index: 0,
      votes: ['1', '2', '3'],
      highestVote: 3,
    });
    expect(result).toBe(false);
  });

  it("returns false when index is 0 but there is only one item in sortedResults", () => {
    sortedResults = [sortedResults[0]];
    sortedResults[0].votes = ['1'] 
    const result = getTieStatus({
      sortedResults,
      index: 0,
      votes: ['1'],
      highestVote: 1,
    });
    expect(result).toBe(false);
  });

  it("returns true when index is not 0 and votes length equals highestVote", () => {
    sortedResults[0].votes = ['1', '2', '3']
    sortedResults[1].votes = ['4', '5', '6'] 
    const result = getTieStatus({
      sortedResults,
      index: 1,
      votes: ['4', '5', '6'],
      highestVote: 3,
    });
    expect(result).toBe(true);
  });

  it("returns false when index is not 0 and votes length does not equal highestVote", () => {
    sortedResults[0].votes = ['1', '2', '3']
    sortedResults[1].votes = ['4', '5'] 
    const result = getTieStatus({
      sortedResults,
      index: 1,
      votes: ['4', '5'],
      highestVote: 3,
    });
    expect(result).toBe(false);
  });
});
