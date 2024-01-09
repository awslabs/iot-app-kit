import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { SiteWiseComponentSession } from '../component-session';
import {
  timeSeriesDataSession,
  assetSession,
  alarmsSession,
} from '../sessions';
import type {
  Provider,
  ProviderObserver,
  TimeSeriesData,
  Viewport,
  DataModuleSubscription,
  SubscriptionUpdate,
} from '@iot-app-kit/core';
import type { SiteWiseDataStreamQuery } from './types';
import { CreateTimeSeriesDataStore } from './store';

/**
 * Provider for SiteWise time series data
 */
export class SiteWiseTimeSeriesDataProvider
  implements Provider<TimeSeriesData[]>
{
  private update: (
    subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>
  ) => void = () => {};
  public session: SiteWiseComponentSession;
  public input: DataModuleSubscription<SiteWiseDataStreamQuery>;
  private store: CreateTimeSeriesDataStore;

  constructor(
    session: SiteWiseComponentSession,
    input: DataModuleSubscription<SiteWiseDataStreamQuery>,
    store: CreateTimeSeriesDataStore
  ) {
    this.session = session;
    this.input = input;
    this.store = store;
  }

  subscribe(observer: ProviderObserver<TimeSeriesData[]>) {
    const { session, store } = this;

    store.setCallback((timeSeriesData: TimeSeriesData) =>
      observer.next([timeSeriesData])
    );

    const { update, unsubscribe } = subscribeToTimeSeriesData(
      timeSeriesDataSession(session),
      assetSession(session),
      alarmsSession(session),
      store
    )(this.input);

    this.update = update;

    /** @todo move into datamodule namespace when sessions are supported on time series module */
    this.session.attachDataModuleSession({
      close: unsubscribe,
    });
  }

  updateSubscription(
    subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>
  ) {
    this.update(subscriptionUpdate);
  }

  unsubscribe() {
    this.session.close();
  }

  updateViewport(viewport: Viewport) {
    this.update({
      request: {
        settings: this.input.request.settings,
        viewport,
      },
    });
  }
}
