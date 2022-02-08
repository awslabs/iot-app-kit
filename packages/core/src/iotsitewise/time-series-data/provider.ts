import { MinimalViewPortConfig } from '@synchro-charts/core';
import { Provider, IoTAppKitComponentSession } from '../../interface';
import { AnyDataStreamQuery, DataModuleSubscription, SubscriptionUpdate } from '../../data-module/types';
import { datamodule } from '../..';
import { subscribeToTimeSeriesData } from './coordinator';
import { TimeSeriesData } from './types';

/**
 * SiteWise time series data provider.
 */
export class SiteWiseTimeSeriesDataProvider implements Provider<TimeSeriesData> {
  private session: IoTAppKitComponentSession;

  private input: DataModuleSubscription<AnyDataStreamQuery>;

  /** reference to the time series module update method returned on subscribe */
  private update: (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => void;

  constructor(session: IoTAppKitComponentSession, input: DataModuleSubscription<AnyDataStreamQuery>) {
    this.session = session;
    this.input = input;
  }

  subscribe = (callback: (data: TimeSeriesData) => void) => {
    const { session } = this;

    const { update, unsubscribe } = subscribeToTimeSeriesData(
      datamodule.iotsitewise.timeSeriesDataSession(session),
      datamodule.iotsitewise.assetDataSession(session)
    )(this.input, callback);

    this.update = update;

    // remove this when time series module supports session creation
    this.session.attachDataModuleSession({
      close: unsubscribe,
    });
  };

  updateSubscription = (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => {
    this.update(subscriptionUpdate);
  };

  unsubscribe = () => {
    this.session.close();
  };

  /** support viewport updates via gestures */
  updateViewport = (viewport: MinimalViewPortConfig) => {
    const request = {
      ...this.input.request,
      viewport,
    };

    this.update({ request });
  };
}
