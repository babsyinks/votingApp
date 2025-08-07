import getTieStatus from "features/results/helpers/getTieStatus";

describe('getTieStatus', () => {
  it('returns true when index is 0 and top two entries have equal vote lengths', () => {
    const sortedResults = [
      { votes: [1, 2] },
      { votes: [3, 4] },
      { votes: [5] }
    ];
    const result = getTieStatus({
      sortedResults,
      index: 0,
      votes: [1, 2],
      highestVote: 2
    });
    expect(result).toBe(true);
  });

  it('returns false when index is 0 and top two entries have different vote lengths', () => {
    const sortedResults = [
      { votes: [1, 2, 3] },
      { votes: [4, 5] }
    ];
    const result = getTieStatus({
      sortedResults,
      index: 0,
      votes: [1, 2, 3],
      highestVote: 3
    });
    expect(result).toBe(false);
  });

  it('returns false when index is 0 but there is only one item in sortedResults', () => {
    const sortedResults = [{ votes: [1] }];
    const result = getTieStatus({
      sortedResults,
      index: 0,
      votes: [1],
      highestVote: 1
    });
    expect(result).toBe(false);
  });

  it('returns true when index is not 0 and votes length equals highestVote', () => {
    const sortedResults = [
      { votes: [1, 2, 3] },
      { votes: [4, 5, 6] }
    ];
    const result = getTieStatus({
      sortedResults,
      index: 1,
      votes: [4, 5, 6],
      highestVote: 3
    });
    expect(result).toBe(true);
  });

  it('returns false when index is not 0 and votes length does not equal highestVote', () => {
    const sortedResults = [
      { votes: [1, 2, 3] },
      { votes: [4, 5] }
    ];
    const result = getTieStatus({
      sortedResults,
      index: 1,
      votes: [4, 5],
      highestVote: 3
    });
    expect(result).toBe(false);
  });
});
