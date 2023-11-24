import merge from 'lodash.merge';
import { completeDataStreams } from '../completeDataStreams';
import type { Threshold, DataStream, ErrorDetails, TimeSeriesData, Viewport } from '@iot-app-kit/core';
import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import type { Alarms } from '../alarms/iotevents';
import { ModeledDataStream } from '../asset-modules/listAssetModelPropertiesWithCompositeModels';

export type TimeSeriesDataStore = {
  dataStreams: DataStream[];
  viewport: Viewport;
  thresholds: Threshold[];
  assetModels: Record<string, DescribeAssetModelResponse>;
  alarms: Alarms;
  errors: Record<string, ErrorDetails>;
  assetModelProperties: ModeledDataStream[];
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
    const { thresholds, viewport, alarms, assetModels, dataStreams, assetModelProperties } = this.state; //add assetProeprties

    this.callback({
      dataStreams: completeDataStreams({
        dataStreams,
        assetModels,
        alarms,
        assetModelProperties,
      }),
      viewport,
      thresholds,
    });
  }

  appendTimeSeriesData(updatedState: Partial<TimeSeriesDataStore>): void {
    const { thresholds, dataStreams, assetModelProperties, ...rest } = updatedState;

    const newDataStreams = (dataStreams as DataStream[])?.filter(
      (dataStream) => !this.state.dataStreams.map(({ id }) => id).includes(dataStream.id)
    );

    this.state.dataStreams = [
      ...this.state.dataStreams.map((dataStream) => {
        const updatedDataStream = (dataStreams as DataStream[])?.find(({ id }) => dataStream.id === id);

        if (updatedDataStream) {
          return { ...dataStream, ...updatedDataStream };
        }

        return dataStream;
      }),
      ...(newDataStreams || []),
    ];

    const oldAssetModelProps = this.state.assetModelProperties ?? [];

    const newAssetModelProperties = assetModelProperties?.filter(
      (assetModelProperty) =>
        !oldAssetModelProps?.map(({ propertyId }) => propertyId).includes(assetModelProperty.propertyId)
    );

    this.state.assetModelProperties = [...oldAssetModelProps, ...(newAssetModelProperties || [])];

    this.state.thresholds = [...this.state.thresholds, ...(thresholds || [])];

    merge(this.state, rest);

    this.update();
  }

  getState() {
    return this.state;
  }
}
