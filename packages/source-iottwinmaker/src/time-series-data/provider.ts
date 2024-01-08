import { ProviderWithViewport, TimeSeriesDataModule } from '@iot-app-kit/core';
import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import type {
  ProviderObserver,
  TimeSeriesData,
  DataModuleSubscription,
  Viewport,
  SubscriptionUpdate,
} from '@iot-app-kit/core';
import type { TwinMakerDataStreamQuery } from './types';

/**
 * Provider for TwinMaker time series data
 */
export class TwinMakerTimeSeriesDataProvider
  implements ProviderWithViewport<TimeSeriesData[]>
{
  private update: (
    subscriptionUpdate: SubscriptionUpdate<TwinMakerDataStreamQuery>
  ) => void = () => {};

  public dataModule: TimeSeriesDataModule<TwinMakerDataStreamQuery>;
  public metadataModule: TwinMakerMetadataModule;

  public input: DataModuleSubscription<TwinMakerDataStreamQuery>;

  private _unsubscribes: (() => void)[] = [];

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
    const { update, unsubscribe } = subscribeToTimeSeriesData(
      this.metadataModule,
      this.dataModule
    )(this.input, (timeSeriesData: TimeSeriesData) =>
      observer.next([timeSeriesData])
    );

    this.update = update;
    this._unsubscribes.push(unsubscribe);
  };

  updateSubscription = (
    subscriptionUpdate: SubscriptionUpdate<TwinMakerDataStreamQuery>
  ) => {
    this.update(subscriptionUpdate);
  };

  unsubscribe = () => {
    this._unsubscribes.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
        const err = e as Error;

        // sometimes things get out of sync, if there's no subscription, then we don't need to do anything.
        if (err.message.includes('subscription does not exist.')) {
          return;
        }

        throw e;
      }
    });
  };

  updateViewport = (viewport: Viewport) => {
    this.update({
      request: {
        settings: this.input.request.settings,
        viewport,
      },
    });
  };
}
