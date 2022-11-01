import { DataStream, DataType, TimeSeriesData, Viewport, viewportEndDate, viewportStartDate } from '@iot-app-kit/core';

import { DataBindingLabelKeys } from '../common/constants';
import { IDataField, IDataFrame, IDataInput, ValueType } from '../interfaces';

const toValueType = (dataType: DataType | undefined): ValueType => {
  switch (dataType) {
    case 'BOOLEAN':
      return 'boolean';
    case 'NUMBER':
      return 'number';
    default:
      return 'string';
  }
};

export const convertDataStreamsToDataInput = (streams: DataStream[], viewport: Viewport): IDataInput => {
  const frames: IDataFrame[] = [];

  streams.forEach((stream) => {
    const labels: Record<string, string> = {};
    Object.keys(stream.meta || {}).forEach((key) => (labels[key] = String(stream.meta?.[key])));

    const fields: IDataField[] = [
      {
        name: 'time',
        valueType: 'time',
        labels,
        values: stream.data.map(({ x }) => x),
      },
      {
        name: labels[DataBindingLabelKeys.propertyName],
        valueType: toValueType(stream.dataType),
        labels,
        values: stream.data.map(({ y }) => (stream.dataType === 'BOOLEAN' ? y === 'true' : y)),
      },
    ];

    frames.push({ dataFrameId: stream.id, fields });
  });

  return {
    dataFrames: frames,
    timeRange: {
      from: viewportStartDate(viewport).getTime(),
      to: viewportEndDate(viewport).getTime(),
    },
  };
};

export const combineTimeSeriesData = (timeSeresDataResults: TimeSeriesData[]): TimeSeriesData =>
  timeSeresDataResults.reduce(
    (timeSeriesData, { dataStreams, viewport, annotations }) => ({
      dataStreams: [...timeSeriesData.dataStreams, ...dataStreams],
      viewport,
      annotations,
    }),
    { dataStreams: [], viewport: { duration: 0 }, annotations: {} },
  );
