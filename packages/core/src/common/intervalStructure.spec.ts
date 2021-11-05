import {
  addInterval,
  intersect,
  IntervalStructure,
  isContained,
  mergeItems,
  subtractIntervals,
} from './intervalStructure';

const INITIAL_STATE = {
  intervals: [],
  items: [],
};

// Ascending sort
const numericalCompare = (a: number, b: number): number => a - b;

describe('intersect intervals', () => {
  it('empty left interval always results in empty interval', () => {
    expect(
      intersect(
        [],
        [
          [1, 2],
          [3, 5],
        ]
      )
    ).toBeEmpty();
  });

  it('empty right interval always results in empty interval', () => {
    expect(
      intersect(
        [
          [1, 2],
          [3, 5],
        ],
        []
      )
    ).toBeEmpty();
  });

  it('single interval on left and right result in only overlapping interval returned', () => {
    expect(intersect([[1, 3]], [[2, 4]])).toEqual([[2, 3]]);
  });

  it('multiple intervals on left and right', () => {
    expect(
      intersect(
        [
          [1, 3],
          [5, 7],
        ],
        [
          [2, 4],
          [6, 8],
        ]
      )
    ).toEqual([
      [2, 3],
      [6, 7],
    ]);
  });

  it('simplifies resulting intersection', () => {
    expect(
      intersect(
        [
          [1, 3],
          [3, 7],
        ],
        [[2, 6]]
      )
    ).toEqual([[2, 6]]);
  });
});

describe('subtract intervals', () => {
  it('subtracting no intervals returns original interval', () => {
    expect(subtractIntervals([0, 1], [])).toEqual([[0, 1]]);
  });

  it('subtracting intervals that do not intersect returns original interval', () => {
    expect(subtractIntervals([0, 1], [[1, 2]])).toEqual([[0, 1]]);
  });

  it('subtracting interval with overlap on right side, returns the non-overlapped side', () => {
    expect(subtractIntervals([0, 1], [[0.5, 2]])).toEqual([[0, 0.5]]);
  });

  it('subtracting interval with overlap on left side, returns the non-overlapped side', () => {
    expect(subtractIntervals([0, 1], [[-1, 0.5]])).toEqual([[0.5, 1]]);
  });

  it('subtracts left and right interval leaving middle segment', () => {
    expect(
      subtractIntervals(
        [0, 1],
        [
          [0, 0.25],
          [0.75, 1],
        ]
      )
    ).toEqual([[0.25, 0.75]]);
  });

  it('subtracting a middle segment returns two intervals on the sides', () => {
    expect(subtractIntervals([0, 1], [[0.25, 0.75]])).toEqual([
      [0, 0.25],
      [0.75, 1],
    ]);
  });

  describe('returns empty array', () => {
    it('subtracting itself returns empty array', () => {
      expect(subtractIntervals([0, 1], [[0, 1]])).toEqual([]);
    });

    it('subtracting interval containing the interval returns empty array', () => {
      expect(subtractIntervals([0, 1], [[-10, 10]])).toEqual([]);
    });

    it('subtracting multiple intervals which over the interval returns empty array', () => {
      expect(
        subtractIntervals(
          [0, 1],
          [
            [0, 0.5],
            [0.5, 1],
          ]
        )
      ).toEqual([]);
    });

    it('subtracting a mess of intervals which cover the interval', () => {
      expect(
        subtractIntervals(
          [-100, 100],
          [
            [-200, -100],
            [-102, -40],
            [-60, 20],
            [0, 10],
            [90, 200],
            [20, 90],
          ]
        )
      ).toEqual([]);
    });
  });
});

describe('is contained', () => {
  it('returns true', () => {
    const cache: IntervalStructure<number> = { intervals: [[883526400000, 915062400000]], items: [[]] };
    expect(isContained(cache, [946598400000, 978220800000])).toBeFalse();
  });

  it('returns false for empty structure', () => {
    expect(
      isContained(
        {
          intervals: [],
          items: [],
        },
        [10, 100]
      )
    ).toBeFalse();
  });

  it('returns true if interval is subset of a interval', () => {
    expect(
      isContained(
        {
          intervals: [[0, 1000]],
          items: [[]],
        },
        [10, 100]
      )
    ).toBeTrue();
  });

  it('returns false if interval is partially overlapped on the right', () => {
    expect(
      isContained(
        {
          intervals: [[0, 1000]],
          items: [[]],
        },
        [-100, 100]
      )
    ).toBeFalse();
  });

  it('returns false if interval is partially overlapped on the left', () => {
    expect(
      isContained(
        {
          intervals: [[0, 1000]],
          items: [[]],
        },
        [900, 1100]
      )
    ).toBeFalse();
  });

  it('returns true if overlapping a single interval of many', () => {
    expect(
      isContained(
        {
          intervals: [
            [-100, -50],
            [0, 1000],
          ],
          items: [[]],
        },
        [100, 400]
      )
    ).toBeTrue();
  });

  it('returns false if interval is not subset of a interval', () => {
    expect(
      isContained(
        {
          intervals: [[0, 20]],
          items: [[]],
        },
        [10, 100]
      )
    ).toBeFalse();
  });
});

describe('merge items', () => {
  it('returns empty items if given empty items', () => {
    expect(mergeItems([], [], numericalCompare)).toEqual([]);
  });

  it('returns first items if second items are empty', () => {
    expect(mergeItems([10, 20], [], numericalCompare)).toEqual([10, 20]);
  });

  it('returns seconds items if first items are empty', () => {
    expect(mergeItems([], [10, 20], numericalCompare)).toEqual([10, 20]);
  });

  it('combines two non-overlapping collections', () => {
    expect(mergeItems([1, 2], [3, 4], numericalCompare)).toEqual([1, 2, 3, 4]);
  });

  it('combines two non-overlapping collections - 2', () => {
    expect(mergeItems([3, 4], [1, 2], numericalCompare)).toEqual([1, 2, 3, 4]);
  });

  it('combines two collections which share a boundary', () => {
    expect(mergeItems([1, 2], [2, 3, 4], numericalCompare)).toEqual([1, 2, 3, 4]);
  });

  it('merged first items into second when second contains all of first', () => {
    expect(mergeItems([1, 2], [0, 1, 2, 3, 4], numericalCompare)).toEqual([0, 1, 2, 3, 4]);
  });

  it('merged first items into second when first contains all of second', () => {
    expect(mergeItems([0, 1, 2, 3, 4], [1, 2], numericalCompare)).toEqual([0, 1, 2, 3, 4]);
  });

  it('merges interval with data not present in second interval, maintains all new data', () => {
    expect(mergeItems([0, 1, 2, 3, 4], [0, 4], numericalCompare)).toEqual([0, 1, 2, 3, 4]);
  });

  it('both intervals contain data the other one does not', () => {
    expect(mergeItems([0, 1, 2, 3, 4], [0, 4, 5], numericalCompare)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('partially overlapping intervals where the first interval contains data not present within the second intervals range', () => {
    expect(mergeItems([0, 1, 2, 3, 4, 5], [3, 5, 7], numericalCompare)).toEqual([0, 1, 2, 3, 4, 5, 7]);
  });

  it('partially overlapping intervals where the second interval contains data not present within the first intervals range', () => {
    expect(mergeItems([3, 5, 7], [0, 1, 2, 3, 4, 5], numericalCompare)).toEqual([0, 1, 2, 3, 5, 7]);
  });
});

describe('adds item to interval structure', () => {
  describe('add interval when no merging needs to occur', () => {
    it('adds item to empty interval structure', () => {
      expect(addInterval(INITIAL_STATE, [10, 100], [10], numericalCompare)).toEqual({
        intervals: [[10, 100]],
        items: [[10]],
      });
    });

    it('adds item to interval structure with no overlapping intervals', () => {
      expect(
        addInterval(
          {
            intervals: [[1000, 9999]],
            items: [[999]],
          },
          [10, 100],
          [10],
          numericalCompare
        )
      ).toEqual({
        intervals: [
          [10, 100],
          [1000, 9999],
        ],
        items: [[10], [999]],
      });
    });

    it('merge overlapping intervals', () => {
      expect(
        addInterval(
          {
            intervals: [[50, 200]],
            items: [[101]],
          },
          [10, 100],
          [10],
          numericalCompare
        )
      ).toEqual({
        intervals: [[10, 200]],
        items: [[10, 101]],
      });
    });
  });

  describe('add interval when merging occurs', () => {
    describe('new interval contains data missing from previous intervals', () => {
      it('new interval data replaces the previous intervals data', () => {
        const structure: IntervalStructure<number> = {
          intervals: [[0, 5]],
          items: [[0, 1, 2, 3, 4, 5]],
        };
        expect(addInterval(structure, [0, 5], [2.5], numericalCompare)).toEqual({
          intervals: [[0, 5]],
          items: [[0, 1, 2, 2.5, 3, 4, 5]],
        });
      });

      it('merges interval with more data than present in containing interval, takes the additional data', () => {
        const structure: IntervalStructure<number> = {
          intervals: [[0, 1000]],
          items: [[1, 55, 121]],
        };
        expect(addInterval(structure, [10, 100], [55, 56, 57], numericalCompare)).toEqual({
          intervals: [[0, 1000]],
          items: [[1, 55, 56, 57, 121]],
        });
      });

      it('merges interval with more data than present in multiple intervals, takes the additional data and merges the intervals', () => {
        const structure: IntervalStructure<number> = {
          intervals: [
            [0, 10],
            [10, 20],
          ],
          items: [
            [0, 5, 10],
            [11, 15, 20],
          ],
        };
        expect(addInterval(structure, [5, 15], [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], numericalCompare)).toEqual({
          intervals: [[0, 20]],
          items: [[0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20]],
        });
      });
    });

    it('merge containing intervals', () => {
      const structure: IntervalStructure<number> = {
        intervals: [[-100, 1000]],
        items: [[1, 55, 121]],
      };
      expect(addInterval(structure, [10, 100], [55], numericalCompare)).toEqual(structure);
    });

    it('merges three intervals into one', () => {
      const structure: IntervalStructure<number> = {
        intervals: [
          [0, 20],
          [40, 100],
        ],
        items: [[15], [55]],
      };
      expect(addInterval(structure, [20, 50], [33], numericalCompare)).toEqual({
        intervals: [[0, 100]],
        items: [[15, 33, 55]],
      });
    });

    it('replaces a series of smaller intervals with one large interval', () => {
      const structure: IntervalStructure<number> = {
        intervals: [
          [0, 10],
          [20, 30],
          [40, 50],
        ],
        items: [
          [5, 6],
          [25, 26],
          [45, 46],
        ],
      };
      expect(addInterval(structure, [0, 50], [5, 6, 25, 26, 35, 45, 46], numericalCompare)).toEqual({
        intervals: [[0, 50]],
        items: [[5, 6, 25, 26, 35, 45, 46]],
      });
    });

    it('replaces a series of smaller intervals with one large interval, merging in the last interval', () => {
      const structure: IntervalStructure<number> = {
        intervals: [
          [20, 30],
          [40, 60],
        ],
        items: [
          [25, 26],
          [45, 60],
        ],
      };
      expect(addInterval(structure, [0, 50], [5, 6, 25, 26, 35, 45], numericalCompare)).toEqual({
        intervals: [[0, 60]],
        items: [[5, 6, 25, 26, 35, 45, 60]],
      });
    });

    it('merges three intervals into one, where each interval contains overlap and unique elemetns', () => {
      const structure: IntervalStructure<number> = {
        intervals: [
          [20, 30],
          [40, 60],
        ],
        items: [
          [20, 30],
          [40, 60],
        ],
      };
      expect(addInterval(structure, [25, 45], [30, 35, 40], numericalCompare)).toEqual({
        intervals: [[20, 60]],
        items: [[20, 30, 35, 40, 60]],
      });
    });
  });
});
