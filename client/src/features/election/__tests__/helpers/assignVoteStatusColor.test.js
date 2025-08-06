import assignVoteStatusColor from "../../helpers/assignVoteStatusColor";

describe("assignVoteStatusColor", () => {
  const contestant = (id, numVotes) => ({
    contestant_id: id,
    votes: Array(numVotes).fill("voter_id"),
    surname: "",
    firstname: "",
    manifesto: "",
    picture: "",
  });

  it("returns yellow for all contestants when there's a tie", () => {
    const contestants = [contestant("c1", 2), contestant("c2", 2), contestant("c3", 2)];
    const result = assignVoteStatusColor(contestants);
    expect(result).toEqual({
      c1: "yellow",
      c2: "yellow",
      c3: "yellow",
    });
  });

  it("assigns lime to the highest voted contestant, red to others", () => {
    const contestants = [contestant("c1", 3), contestant("c2", 5), contestant("c3", 2)];
    const result = assignVoteStatusColor(contestants);
    expect(result).toEqual({
      c1: "red",
      c2: "lime",
      c3: "red",
    });
  });

  it("assigns lime to multiple contestants if they tie for highest", () => {
    const contestants = [contestant("c1", 5), contestant("c2", 5), contestant("c3", 2)];
    const result = assignVoteStatusColor(contestants);
    expect(result).toEqual({
      c1: "lime",
      c2: "lime",
      c3: "red",
    });
  });

it("returns lime if only one contestant (highest by default)", () => {
  const contestants = [contestant("solo", 10)];
  const result = assignVoteStatusColor(contestants);
  expect(result).toEqual({
    solo: "lime",
  });
});


  it("returns empty object when contestants is empty", () => {
    const result = assignVoteStatusColor([]);
    expect(result).toEqual({});
  });
});
