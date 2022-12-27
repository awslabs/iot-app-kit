import {
  Provider,
  ProviderObserver,
  TimeSeriesData,
  DataModuleSubscription,
  SubscriptionUpdate,
  TimeSeriesDataModule,
} from '@iot-app-kit/core';
import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { TwinMakerDataStreamQuery } from './types';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';

/**
 * Provider for TwinMaker time series data
 */
export class TwinMakerTimeSeriesDataProvider implements Provider<TimeSeriesData[]> {
  private update: (subscriptionUpdate: SubscriptionUpdate<TwinMakerDataStreamQuery>) => void;

  public dataModule: TimeSeriesDataModule<TwinMakerDataStreamQuery>;
  public metadataModule: TwinMakerMetadataModule;

  public input: DataModuleSubscription<TwinMakerDataStreamQuery>;

  private _unsubscribes: (() => void)[] = [];
  private _unsubscribeFromDataStream: ((id: string) => void)[] = [];

  constructor(
    metadataModule: TwinMakerMetadataModule,
    dataModule: TimeSeriesDataModule<TwinMakerDataStreamQuery>,
    input: DataModuleSubscription<TwinMakerDataStreamQuery>
  ) {
    this.metadataModule = metadataModule;
    this.dataModule = dataModule;
    this.input = input;
  }

  subscribe = (observer: ProviderObserver<TimeSeriesData[]>) => {
    const { update, unsubscribe, unsubscribeFromDataStream } = subscribeToTimeSeriesData(this.metadataModule, this.dataModule)(
      this.input,
      (timeSeriesData: TimeSeriesData) => observer.next([timeSeriesData])
    );

    this.update = update;
    this._unsubscribes.push(unsubscribe);
    this._unsubscribeFromDataStream.push(unsubscribeFromDataStream);
  };

  updateSubscription = (subscriptionUpdate: SubscriptionUpdate<TwinMakerDataStreamQuery>) => {
    this.update(subscriptionUpdate);
  };

  unsubscribe = () => {
    this._unsubscribes.forEach((unsub) => unsub());
  };

  unsubscribeFromDataStream = (id: string) => {
    this._unsubscribeFromDataStream.forEach((unsub) => unsub(id))
  }

  updateViewport = (viewport: MinimalViewPortConfig) => {
    this.update({
      request: {
        settings: this.input.request.settings,
        viewport,
      },
    });
  };
}
