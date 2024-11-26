import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import type {
  DataStream,
  ErrorDetails,
  Threshold,
  TimeSeriesData,
  Viewport,
} from '@iot-app-kit/core';
import merge from 'lodash-es/merge';
import type { Alarms } from '../alarms/iotevents';
import type { ModeledDataStream } from '../asset-modules/describeModeledDataStreamRequest/types';
import { completeDataStreams } from '../completeDataStreams';

export type TimeSeriesDataStore = {
  modeledDataStreams: ModeledDataStream[];
  dataStreams: DataStream[];
  viewport: Viewport;
  thresholds: Threshold[];
  assetModels: Record<string, DescribeAssetModelResponse>;
  alarms: Alarms;
  errors: Record<string, ErrorDetails>;
};

export class CreateTimeSeriesDataStore {
  private readonly state: TimeSeriesDataStore;
  private readonly callback: (data: TimeSeriesData) => void;

  constructor({
    initialState,
    callback,
  }: {
    initialState: Partial<TimeSeriesDataStore>;
    callback: (data: TimeSeriesData) => void;
  }) {
    this.callback = callback;
    this.state = { ...initialState } as TimeSeriesDataStore;
  }

  update() {
    const {
      thresholds,
      viewport,
      alarms,
      assetModels,
      dataStreams,
      modeledDataStreams,
    } = this.state; //add assetProeprties

    this.callback({
      dataStreams: completeDataStreams({
        dataStreams,
        assetModels,
        alarms,
        modeledDataStreams,
      }),
      viewport,
      thresholds,
    });
  }

  appendTimeSeriesData(updatedState: Partial<TimeSeriesDataStore>): void {
    const { thresholds, dataStreams, modeledDataStreams, ...rest } =
      updatedState;

    const newDataStreams = (dataStreams as DataStream[])?.filter(
      (dataStream) =>
        !this.state.dataStreams.map(({ id }) => id).includes(dataStream.id)
    );

    this.state.dataStreams = [
      ...this.state.dataStreams.map((dataStream) => {
        const updatedDataStream = (dataStreams as DataStream[])?.find(
          ({ id }) => dataStream.id === id
        );

        if (updatedDataStream) {
          return { ...dataStream, ...updatedDataStream };
        }

        return dataStream;
      }),
      ...(newDataStreams || []),
    ];

    this.state.modeledDataStreams = [
      ...this.state.modeledDataStreams,
      ...(modeledDataStreams || []),
    ];

    this.state.thresholds = [...this.state.thresholds, ...(thresholds || [])];

    merge(this.state, rest);

    this.update();
  }

  getState() {
    return this.state;
  }
}
