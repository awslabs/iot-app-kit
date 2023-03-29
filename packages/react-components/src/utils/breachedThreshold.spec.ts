import { DATA_TYPE } from '@iot-app-kit/core';
import { breachedAlarmThresholds, breachedThreshold } from './breachedThreshold';
import { COMPARISON_OPERATOR, StreamType } from '../common/constants';
import { SECOND_IN_MS } from './time';
import type { Threshold, DataStream, DataPoint } from '@iot-app-kit/core';

const ALARM_DATA_STREAM: DataStream<string> = {
  id: 'alarm-id',
  dataType: DATA_TYPE.STRING,
  name: 'alarm-info',
  color: 'green',
  streamType: StreamType.ALARM,
  data: [],
  resolution: 0,
};

const PROPERTY_STREAM: DataStream<number> = {
  id: 'some-id',
  name: 'some-name',
  dataType: DATA_TYPE.NUMBER,
  data: [],
  color: 'red',
  associatedStreams: [{ id: ALARM_DATA_STREAM.id, type: StreamType.ALARM }],
  resolution: 0,
};

const NUMERICAL_THRESHOLD: Threshold<number> = {
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 40,
  color: 'red',
};

const THRESHOLD_VALUE = 'berries';

const THRESHOLD: Threshold = {
  color: 'blue',
  value: THRESHOLD_VALUE,
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
};

const BREACHING_VALUE = THRESHOLD_VALUE;
const NON_BREACHING_VALUE = 'banana berries';

describe('breachedThreshold', () => {
  it('returned undefined when nothing is passed in', () => {
    expect(
      breachedThreshold({
        value: undefined,
        dataStreams: [],
        thresholds: [],
        date: new Date(),
        dataStream: PROPERTY_STREAM,
      })
    ).toBeUndefined();
  });

  it('returns breached threshold when breaching a threshold with a value of zero', () => {
    expect(
      breachedThreshold({
        value: 0, // breaches threshold
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: [],
        thresholds: [NUMERICAL_THRESHOLD],
      })
    ).toEqual(NUMERICAL_THRESHOLD);
  });

  it('returns breached threshold', () => {
    expect(
      breachedThreshold({
        value: NUMERICAL_THRESHOLD.value - 5, // breaches threshold
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: [],
        thresholds: [THRESHOLD, NUMERICAL_THRESHOLD],
      })
    ).toEqual(NUMERICAL_THRESHOLD);
  });

  it('returns breached alarm threshold', () => {
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [
          {
            x: Date.now(),
            y: BREACHING_VALUE,
          },
        ],
      },
    ];

    expect(
      breachedThreshold({
        value: undefined,
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: DATA_STREAMS,
        thresholds: [THRESHOLD],
      })
    ).toEqual(THRESHOLD);
  });

  it('returns alarm with threshold with severity specified when multiple threshold available', () => {
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [
          {
            x: Date.now(),
            y: BREACHING_VALUE,
          },
        ],
      },
    ];
    const ALARM_W_SEVERITY_THRESHOLD: Threshold = {
      ...THRESHOLD,
      severity: 1,
    };

    expect(
      breachedThreshold({
        value: NUMERICAL_THRESHOLD.value - 5, // breaches threshold
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: DATA_STREAMS,
        thresholds: [ALARM_W_SEVERITY_THRESHOLD, NUMERICAL_THRESHOLD],
      })
    ).toEqual(ALARM_W_SEVERITY_THRESHOLD);
  });

  it('returns alarm with the numerical threshold with the lower severity', () => {
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [
          {
            x: Date.now(),
            y: BREACHING_VALUE,
          },
        ],
      },
    ];
    const ALARM_W_SEVERITY_2_THRESHOLD: Threshold = {
      ...NUMERICAL_THRESHOLD,
      severity: 2,
    };
    const ALARM_W_SEVERITY_1_THRESHOLD: Threshold = {
      ...NUMERICAL_THRESHOLD,
      severity: 1,
    };

    expect(
      breachedThreshold({
        value: NUMERICAL_THRESHOLD.value - 5, // breaches threshold
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: DATA_STREAMS,
        thresholds: [ALARM_W_SEVERITY_1_THRESHOLD, ALARM_W_SEVERITY_2_THRESHOLD],
      })
    ).toEqual(ALARM_W_SEVERITY_1_THRESHOLD);
  });

  it('returns alarm with threshold with the lower severity', () => {
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [
          {
            x: Date.now(),
            y: BREACHING_VALUE,
          },
        ],
      },
    ];
    const ALARM_W_SEVERITY_2_THRESHOLD: Threshold = {
      ...THRESHOLD,
      severity: 2,
    };
    const ALARM_W_SEVERITY_1_THRESHOLD: Threshold = {
      ...THRESHOLD,
      severity: 1,
    };

    expect(
      breachedThreshold({
        value: NUMERICAL_THRESHOLD.value - 5, // breaches threshold
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: DATA_STREAMS,
        thresholds: [ALARM_W_SEVERITY_1_THRESHOLD, ALARM_W_SEVERITY_2_THRESHOLD],
      })
    ).toEqual(ALARM_W_SEVERITY_1_THRESHOLD);
  });
});

describe('breachedAlarmThresholds', () => {
  it('returns empty list when provided no thresholds', () => {
    expect(
      breachedAlarmThresholds({
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: [ALARM_DATA_STREAM],
        thresholds: [],
      })
    ).toEqual([]);
  });

  it('returns empty list when provided no data', () => {
    expect(
      breachedAlarmThresholds({
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: [],
        thresholds: [THRESHOLD],
      })
    ).toEqual([]);
  });

  it('returns empty list when data point does not breach any thresholds', () => {
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [
          {
            x: Date.now(),
            y: NON_BREACHING_VALUE,
          },
        ],
      },
    ];

    expect(
      breachedAlarmThresholds({
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: DATA_STREAMS,
        thresholds: [THRESHOLD],
      })
    ).toEqual([]);
  });

  it('returns breached threshold when data point does breach the threshold', () => {
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [
          {
            x: Date.now(),
            y: BREACHING_VALUE,
          },
        ],
      },
    ];

    expect(
      breachedAlarmThresholds({
        date: new Date(),
        dataStream: PROPERTY_STREAM,
        dataStreams: DATA_STREAMS,
        thresholds: [THRESHOLD],
      })
    ).toEqual([THRESHOLD]);
  });

  it('returns empty list when threshold would be breached, but doesnt have the data stream associated to it as an alarm', () => {
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [
          {
            x: Date.now(),
            y: BREACHING_VALUE,
          },
        ],
      },
    ];

    expect(
      breachedAlarmThresholds({
        date: new Date(),
        dataStream: { ...PROPERTY_STREAM, associatedStreams: [] },
        dataStreams: DATA_STREAMS,
        thresholds: [THRESHOLD],
      })
    ).toEqual([]);
  });

  it('returns empty list if the date selected is before all points in a alarm stream, causing that status not to be breached', () => {
    const DATA_POINT: DataPoint<string> = {
      x: Date.now(),
      y: BREACHING_VALUE,
    };
    const DATA_STREAMS = [
      {
        ...ALARM_DATA_STREAM,
        data: [DATA_POINT],
      },
    ];

    expect(
      breachedAlarmThresholds({
        date: new Date(DATA_POINT.x - SECOND_IN_MS),
        dataStream: PROPERTY_STREAM,
        dataStreams: DATA_STREAMS,
        thresholds: [THRESHOLD],
      })
    ).toEqual([]);
  });
});
