import getSortedResults from "features/results/helpers/getSortedResults";

describe('getSortedResults', () => {
  it('returns contestants sorted by descending vote count when more than one contestant', () => {
    const result = [
      {
        contestants: [
          { id: 'A', votes: [1, 2] },
          { id: 'B', votes: [1] },
          { id: 'C', votes: [1, 2, 3] },
        ],
      },
    ];

    const sorted = getSortedResults(result, 0);
    expect(sorted).toEqual([
      { id: 'C', votes: [1, 2, 3] },
      { id: 'A', votes: [1, 2] },
      { id: 'B', votes: [1] },
    ]);
  });

  it('returns contestants as-is when only one contestant is present', () => {
    const result = [
      {
        contestants: [{ id: 'X', votes: [1, 2, 3] }],
      },
    ];

    const sorted = getSortedResults(result, 0);
    expect(sorted).toEqual([{ id: 'X', votes: [1, 2, 3] }]);
  });

  it('handles empty contestants array gracefully', () => {
    const result = [
      {
        contestants: [],
      },
    ];

    const sorted = getSortedResults(result, 0);
    expect(sorted).toEqual([]);
  });

  it('does not mutate the original contestants array', () => {
    const result = [
      {
        contestants: [
          { id: 'A', votes: [1] },
          { id: 'B', votes: [1, 2] },
        ],
      },
    ];

    const original = [...result[0].contestants];
    getSortedResults(result, 0);
    expect(result[0].contestants).not.toEqual(original);
  });
});
