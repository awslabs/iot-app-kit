import { DataStream, ErrorDetails, TimeSeriesData } from '@iot-app-kit/core';
import { Annotations, MinimalViewPortConfig } from '@synchro-charts/core';
import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import mergeWith from 'lodash.mergewith';
import merge from 'lodash.merge';
import { Alarms } from '../alarms/iotevents';
import { completeDataStreams } from '../completeDataStreams';

export type TimeSeriesDataStore = {
  dataStreams: DataStream[];
  viewport: MinimalViewPortConfig;
  annotations: Annotations;
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
    this.state = initialState as TimeSeriesDataStore;
  }

  update() {
    const { annotations, viewport, alarms, assetModels, dataStreams } = this.state;

    this.callback({
      dataStreams: completeDataStreams({
        dataStreams,
        assetModels,
        alarms,
      }),
      viewport,
      annotations,
    });
  }

  appendTimeSeriesData(updatedState: Partial<TimeSeriesDataStore>): void {
    const { annotations, ...rest } = updatedState;
    merge(this.state, rest);
    mergeWith(this.state, { annotations }, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });
    this.update();
  }

  getState() {
    return this.state;
  }
}
