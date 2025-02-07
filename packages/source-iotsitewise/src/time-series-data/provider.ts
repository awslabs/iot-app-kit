import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { type SiteWiseComponentSession } from '../component-session';
import {
  alarmsSession,
  assetSession,
  timeSeriesDataSession,
} from '../sessions';
import type {
  DataModuleSubscription,
  Provider,
  ProviderObserver,
  SubscriptionUpdate,
  TimeSeriesData,
  Viewport,
} from '@iot-app-kit/core';
import type { SiteWiseDataStreamQuery } from './types';

/** Provider for SiteWise time series data */
export class SiteWiseTimeSeriesDataProvider
  implements Provider<TimeSeriesData[]>
{
  public session: SiteWiseComponentSession;
  public input: DataModuleSubscription<SiteWiseDataStreamQuery>;

  constructor(
    session: SiteWiseComponentSession,
    input: DataModuleSubscription<SiteWiseDataStreamQuery>
  ) {
    this.session = session;
    this.input = input;
  }

  subscribe(observer: ProviderObserver<TimeSeriesData[]>) {
    const { session } = this;

    const { update, unsubscribe } = subscribeToTimeSeriesData(
      timeSeriesDataSession(session),
      assetSession(session),
      alarmsSession(session)
    )(this.input, (timeSeriesData: TimeSeriesData) =>
      observer.next([timeSeriesData])
    );

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

  private update: (
    subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>
  ) => void = () => {};
}
