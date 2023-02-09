import { DataPoint, ViewPort } from '../common/dataTypes';
import { activePoints } from './activePoints';
import { HOUR_IN_MS, MINUTE_IN_MS, SECOND_IN_MS, YEAR_IN_MS } from './time';
import { DATA_STREAM } from '../testing/mockWidgetProperties';
import { DATA_ALIGNMENT, DataType } from '../common/constants';

const STREAM_ID = 'stream-id';
const STREAM_ID_2 = 'stream-id-2';
const STREAM_ID_3 = 'stream-id-3';

const VIEWPORT: ViewPort = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  yMin: 0,
  yMax: 100,
};

const DATA_POINT_BEFORE_VIEWPORT: DataPoint = {
  x: new Date(1999, 0, 0).getTime(),
  y: 0,
};

const DATA_POINT_IN_VIEWPORT_1: DataPoint = {
  x: new Date(2000, 3, 0).getTime(),
  y: 25,
};

const DATA_POINT_IN_VIEWPORT_2: DataPoint = {
  x: new Date(2000, 6, 0).getTime(),
  y: 50,
};

const DATA_POINT_IN_VIEWPORT_3: DataPoint = {
  x: new Date(2000, 9, 0).getTime(),
  y: 75,
};

const DATA_POINT_AFTER_VIEWPORT: DataPoint = {
  x: new Date(2002, 0, 0).getTime(),
  y: 100,
};

describe('right data alignment', () => {
  it('returns no points if there is only data to the left of the selected date', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.RIGHT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x + SECOND_IN_MS),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: undefined, streamId: STREAM_ID }]);
  });

  it('returns data point if data point falls exactly on selected date', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.RIGHT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });

  it('returns data point if data point is after the selected date', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.RIGHT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x - SECOND_IN_MS),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });

  it('returns data point if data point is after the selected date far in the future', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.RIGHT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x - YEAR_IN_MS),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });

  it('returns no points if the closest point to the right is further than the max duration', () => {
    const MAX_DURATION_FROM_DATE = MINUTE_IN_MS;
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.RIGHT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x - 2 * MAX_DURATION_FROM_DATE),
        allowMultipleDates: false,
        maxDurationFromDate: MAX_DURATION_FROM_DATE,
      })
    ).toEqual([{ streamId: STREAM_ID, point: undefined }]);
  });

  it('returns point if the closest point to the right is closer than the max duration', () => {
    const MAX_DURATION_FROM_DATE = MINUTE_IN_MS;
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.RIGHT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x - 0.5 * MAX_DURATION_FROM_DATE),
        allowMultipleDates: false,
        maxDurationFromDate: MAX_DURATION_FROM_DATE,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });
});

describe('left data alignment', () => {
  it('returns no points if there is only data to the right of the selected date', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.LEFT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x - SECOND_IN_MS),
        allowMultipleDates: false,
      })
    ).toEqual([{ streamId: STREAM_ID, point: undefined }]);
  });

  it('returns data point if data point falls exactly on selected date', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.LEFT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });

  it('returns data point if data point is before the selected date', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.LEFT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x + SECOND_IN_MS),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });

  it('returns data point if data point is before the selected date far in the past', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.LEFT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x + YEAR_IN_MS),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });

  it('returns no points if the closest point to the left is further than the max duration', () => {
    const MAX_DURATION_FROM_DATE = MINUTE_IN_MS;
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.LEFT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x + 2 * MAX_DURATION_FROM_DATE),
        allowMultipleDates: false,
        maxDurationFromDate: MAX_DURATION_FROM_DATE,
      })
    ).toEqual([{ streamId: STREAM_ID, point: undefined }]);
  });

  it('returns point if the closest point to the left is closer than the max duration', () => {
    const MAX_DURATION_FROM_DATE = MINUTE_IN_MS;
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.LEFT,
        dataStreams: [
          {
            id: STREAM_ID,
            name: 'name',
            data: [DATA_POINT_IN_VIEWPORT_1],
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
        selectedDate: new Date(DATA_POINT_IN_VIEWPORT_1.x + 0.5 * MAX_DURATION_FROM_DATE),
        allowMultipleDates: false,
        maxDurationFromDate: MAX_DURATION_FROM_DATE,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
  });
});

describe('data alignment set to either side', () => {
  describe('with only one date allowed', () => {
    it('with a single point within a view port, return that point', () => {
      expect(
        activePoints({
          viewport: VIEWPORT,
          dataAlignment: DATA_ALIGNMENT.EITHER,
          dataStreams: [
            {
              id: STREAM_ID,
              name: 'name',
              data: [DATA_POINT_IN_VIEWPORT_1],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ],
          selectedDate: new Date(DATA_POINT_IN_VIEWPORT_2.x),
          allowMultipleDates: false,
        })
      ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
    });

    it('with multiple points with different dates, only return the closest point', () => {
      expect(
        activePoints({
          viewport: VIEWPORT,
          dataAlignment: DATA_ALIGNMENT.EITHER,
          dataStreams: [
            {
              id: STREAM_ID,
              name: 'name',
              data: [DATA_POINT_IN_VIEWPORT_1, DATA_POINT_IN_VIEWPORT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ],
          selectedDate: new Date(DATA_POINT_IN_VIEWPORT_2.x),
          allowMultipleDates: false,
        })
      ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_2, streamId: STREAM_ID }]);
    });

    it('with multiple points with the same dates, return all the points', () => {
      const SOME_DATE = new Date(2000, 1, 0);
      const POINT_1 = { x: SOME_DATE.getTime(), y: 10 };
      const POINT_2 = { x: SOME_DATE.getTime(), y: 20 };

      expect(
        activePoints({
          viewport: VIEWPORT,
          dataAlignment: DATA_ALIGNMENT.EITHER,
          dataStreams: [
            {
              id: STREAM_ID,
              name: 'name',
              data: [POINT_1, POINT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
            {
              id: STREAM_ID_2,
              name: 'name',
              data: [POINT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ],
          selectedDate: SOME_DATE,
          allowMultipleDates: false,
        })
      ).toEqual([
        { point: POINT_1, streamId: STREAM_ID },
        { point: POINT_2, streamId: STREAM_ID_2 },
      ]);
    });

    it('with multiple points with the same dates, and some without the same date, only return the points that have the same date', () => {
      const SOME_DATE = new Date(2000, 1, 0);
      const OTHER_DATE = new Date(2000, 2, 0);
      const POINT_1 = { x: SOME_DATE.getTime(), y: 10 };
      const POINT_2 = { x: SOME_DATE.getTime(), y: 20 };
      const POINT_WITH_OTHER_DATE = { x: OTHER_DATE.getTime(), y: 20 };

      expect(
        activePoints({
          viewport: VIEWPORT,
          dataAlignment: DATA_ALIGNMENT.EITHER,
          dataStreams: [
            {
              id: STREAM_ID,
              name: 'name',
              data: [POINT_1],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
            {
              id: STREAM_ID_2,
              name: 'name',
              data: [POINT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
            {
              id: STREAM_ID_3,
              name: 'name',
              data: [POINT_WITH_OTHER_DATE],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ],
          selectedDate: new Date(2000, 1, 1),
          allowMultipleDates: false,
        })
      ).toEqual([
        { point: POINT_1, streamId: STREAM_ID },
        { point: POINT_2, streamId: STREAM_ID_2 },
      ]);
    });
  });

  describe('with multiple dates allowed', () => {
    it('returns no active points when there are no data streams', () => {
      expect(
        activePoints({
          viewport: VIEWPORT,
          dataAlignment: DATA_ALIGNMENT.EITHER,
          dataStreams: [],
          selectedDate: new Date(2000, 6, 0),
          allowMultipleDates: true,
        })
      ).toEqual([]);
    });

    describe('when there is one data stream', () => {
      it('returns no active points when all points are after the viewport', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [DATA_POINT_AFTER_VIEWPORT, DATA_POINT_AFTER_VIEWPORT],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date(2000, 6, 0),
            allowMultipleDates: true,
          })
        ).toEqual([{ streamId: STREAM_ID, point: undefined }]);
      });

      it('returns the point which has a date exactly matching the selected date', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [
                  DATA_POINT_BEFORE_VIEWPORT,
                  DATA_POINT_IN_VIEWPORT_1,
                  DATA_POINT_IN_VIEWPORT_2,
                  DATA_POINT_IN_VIEWPORT_3,
                  DATA_POINT_AFTER_VIEWPORT,
                ],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date(DATA_POINT_IN_VIEWPORT_2.x),
            allowMultipleDates: true,
          })
        ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_2, streamId: STREAM_ID }]);
      });

      it('returns the right most point when the selected date is equidistant from two points', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [
                  DATA_POINT_BEFORE_VIEWPORT,
                  DATA_POINT_IN_VIEWPORT_1,
                  DATA_POINT_IN_VIEWPORT_2,
                  DATA_POINT_IN_VIEWPORT_3,
                  DATA_POINT_AFTER_VIEWPORT,
                ],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date((DATA_POINT_IN_VIEWPORT_1.x + DATA_POINT_IN_VIEWPORT_2.x) / 2),
            allowMultipleDates: true,
          })
        ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_2, streamId: STREAM_ID }]);
      });

      it('returns the right biased point when the closest point is to the left of the selected date', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [
                  DATA_POINT_BEFORE_VIEWPORT,
                  DATA_POINT_IN_VIEWPORT_1,
                  DATA_POINT_IN_VIEWPORT_2,
                  DATA_POINT_IN_VIEWPORT_3,
                  DATA_POINT_AFTER_VIEWPORT,
                ],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date((DATA_POINT_IN_VIEWPORT_1.x + DATA_POINT_IN_VIEWPORT_2.x) / 2 - MINUTE_IN_MS),
            allowMultipleDates: true,
          })
        ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_2, streamId: STREAM_ID }]);
      });

      it('returns the right biased point when the closest point is to the right of the selected date', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [
                  DATA_POINT_BEFORE_VIEWPORT,
                  DATA_POINT_IN_VIEWPORT_1,
                  DATA_POINT_IN_VIEWPORT_2,
                  DATA_POINT_IN_VIEWPORT_3,
                  DATA_POINT_AFTER_VIEWPORT,
                ],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date((DATA_POINT_IN_VIEWPORT_1.x + DATA_POINT_IN_VIEWPORT_2.x) / 2 + MINUTE_IN_MS),
            allowMultipleDates: true,
          })
        ).toEqual([{ streamId: STREAM_ID, point: DATA_POINT_IN_VIEWPORT_2 }]);
      });

      it('returns the closest point within the viewport', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [
                  DATA_POINT_BEFORE_VIEWPORT,
                  DATA_POINT_IN_VIEWPORT_1,
                  DATA_POINT_IN_VIEWPORT_2,
                  DATA_POINT_IN_VIEWPORT_3,
                  DATA_POINT_AFTER_VIEWPORT,
                ],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date((DATA_POINT_IN_VIEWPORT_3.x + DATA_POINT_AFTER_VIEWPORT.x) / 2 + MINUTE_IN_MS),
            allowMultipleDates: true,
          })
        ).toEqual([{ streamId: STREAM_ID, point: DATA_POINT_IN_VIEWPORT_3 }]);
      });
    });

    describe('when there are multiple data streams', () => {
      it('returns the closest point across multiple data streams', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [DATA_POINT_BEFORE_VIEWPORT, DATA_POINT_IN_VIEWPORT_1, DATA_POINT_AFTER_VIEWPORT],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
              {
                id: STREAM_ID_2,
                name: 'name',
                data: [DATA_POINT_BEFORE_VIEWPORT, DATA_POINT_IN_VIEWPORT_2, DATA_POINT_AFTER_VIEWPORT],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date(2000, 6, 0),
            allowMultipleDates: true,
          })
        ).toEqual([
          { point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID },
          { point: DATA_POINT_IN_VIEWPORT_2, streamId: STREAM_ID_2 },
        ]);
      });

      it('returns points for each stream which has data within the viewport', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [DATA_POINT_IN_VIEWPORT_1, DATA_POINT_AFTER_VIEWPORT],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
              {
                id: STREAM_ID_2,
                name: 'name',
                data: [DATA_POINT_BEFORE_VIEWPORT, DATA_POINT_AFTER_VIEWPORT],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date(2000, 6, 0),
            allowMultipleDates: true,
          })
        ).toEqual([
          { point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID },
          { point: DATA_POINT_BEFORE_VIEWPORT, streamId: STREAM_ID_2 },
        ]);
      });

      it('only returns point for one data stream when points have different dates but allowMultipleDates is false', () => {
        expect(
          activePoints({
            viewport: VIEWPORT,
            dataAlignment: DATA_ALIGNMENT.EITHER,
            dataStreams: [
              {
                id: STREAM_ID,
                name: 'name',
                data: [DATA_POINT_IN_VIEWPORT_1, DATA_POINT_AFTER_VIEWPORT],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
              {
                id: STREAM_ID_2,
                name: 'name',
                data: [DATA_POINT_BEFORE_VIEWPORT, DATA_POINT_AFTER_VIEWPORT],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ],
            selectedDate: new Date(2000, 6, 0),
            allowMultipleDates: false,
          })
        ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: STREAM_ID }]);
      });
    });
  });
});

describe('aggregated data', () => {
  it('does not return any active points when requesting raw data but there is only aggregated data', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.EITHER,
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [],
            aggregates: { [MINUTE_IN_MS]: [DATA_POINT_IN_VIEWPORT_1, DATA_POINT_AFTER_VIEWPORT] },
            resolution: 0,
          },
        ],
        selectedDate: new Date(2000, 6, 0),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: undefined, streamId: DATA_STREAM.id }]);
  });

  it('does not return any active points when requesting aggregated data but there is only raw data', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.EITHER,
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [DATA_POINT_IN_VIEWPORT_1, DATA_POINT_AFTER_VIEWPORT],
            aggregates: { [MINUTE_IN_MS]: [] },
            resolution: MINUTE_IN_MS,
          },
        ],
        selectedDate: new Date(2000, 6, 0),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: undefined, streamId: DATA_STREAM.id }]);
  });

  it('does return the aggregate data when requested', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.EITHER,
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [],
            aggregates: { [MINUTE_IN_MS]: [DATA_POINT_IN_VIEWPORT_1] },
            resolution: MINUTE_IN_MS,
          },
        ],
        selectedDate: new Date(2000, 6, 0),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: DATA_STREAM.id }]);
  });

  it('only returns aggregated data of the correct resolution', () => {
    expect(
      activePoints({
        viewport: VIEWPORT,
        dataAlignment: DATA_ALIGNMENT.EITHER,
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [],
            aggregates: { [MINUTE_IN_MS]: [DATA_POINT_IN_VIEWPORT_1], [HOUR_IN_MS]: [DATA_POINT_IN_VIEWPORT_2] },
            resolution: MINUTE_IN_MS,
          },
        ],
        selectedDate: new Date(2000, 6, 0),
        allowMultipleDates: false,
      })
    ).toEqual([{ point: DATA_POINT_IN_VIEWPORT_1, streamId: DATA_STREAM.id }]);
  });
});
