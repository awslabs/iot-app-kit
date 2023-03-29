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
        // the boolean value y will be a string 'true' or 'false' when data is coming from app kit data source,
        // but can be actual boolean when from other source
        values: stream.data.map(({ y }) => (stream.dataType === 'BOOLEAN' ? y === 'true' || (y as any) === true : y)),
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
    (timeSeriesData, { dataStreams, viewport, thresholds }) => ({
      dataStreams: [...timeSeriesData.dataStreams, ...dataStreams],
      viewport,
      thresholds,
    }),
    { dataStreams: [], viewport: { duration: 0 }, thresholds: [] },
  );
