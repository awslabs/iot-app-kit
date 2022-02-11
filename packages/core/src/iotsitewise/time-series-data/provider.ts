import { Provider, IoTAppKitComponentSession } from '../../interface';
import { AnyDataStreamQuery, DataModuleSubscription, SubscriptionUpdate } from '../../data-module/types';
import { datamodule } from '../..';
import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { TimeSeriesData } from './types';
import { MinimalViewPortConfig } from '@synchro-charts/core';

/**
 * Provider for SiteWise time series data
 */
export class SiteWiseTimeSeriesDataProvider implements Provider<TimeSeriesData> {
  private session: IoTAppKitComponentSession;

  private update: (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => void;

  public input: DataModuleSubscription<AnyDataStreamQuery>;

  constructor(session: IoTAppKitComponentSession, input: DataModuleSubscription<AnyDataStreamQuery>) {
    this.session = session;
    this.input = input;
  }

  subscribe(callback: (data: TimeSeriesData) => void) {
    const { session } = this;

    const { update, unsubscribe } = subscribeToTimeSeriesData(
      datamodule.iotsitewise.timeSeriesDataSession(session),
      datamodule.iotsitewise.assetDataSession(session)
    )(this.input, callback);

    this.update = update;

    /** @todo move into datamodule namespace when sessions are supported on time series module */
    this.session.attachDataModuleSession({
      close: unsubscribe,
    });
  }

  updateSubscription(subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) {
    this.update(subscriptionUpdate);
  }

  unsubscribe() {
    this.session.close();
  }

  updateViewport(viewport: MinimalViewPortConfig) {
    this.update({
      request: {
        settings: this.input.request.settings,
        viewport,
      },
    });
  }
}
