import { DataModuleSubscription, SubscriptionUpdate } from '../../data-module/types';
import { datamodule, IoTAppKitComponentSession, Provider } from '../..';
import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { TimeSeriesData, SiteWiseDataStreamQuery } from './types';
import { MinimalViewPortConfig } from '@synchro-charts/core';

/**
 * Provider for SiteWise time series data
 */
export class SiteWiseTimeSeriesDataProvider implements Provider<TimeSeriesData> {
  private update: (subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>) => void;

  public session: IoTAppKitComponentSession;

  public input: DataModuleSubscription<SiteWiseDataStreamQuery>;

  constructor(session: IoTAppKitComponentSession, input: DataModuleSubscription<SiteWiseDataStreamQuery>) {
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

  updateSubscription(subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>) {
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

/**
 * Utility to compose multiple sitewise providers into a single provider.
 * Used to ensure we only create a single sitewise time series subscription for a given component.
 * Note: session and request settings are taken from the first provider.
 *
 * @param providers - providers to compose
 */
export const composeSiteWiseProviders = (
  providers: SiteWiseTimeSeriesDataProvider[]
): SiteWiseTimeSeriesDataProvider => {
  if (providers.length === 0) {
    throw new Error(`composeSiteWiseProviders must be called with at least one provider`);
  }

  if (providers.length === 1) {
    return providers[0];
  }

  const composedParams = providers.slice(1).reduce(
    (prev, next) => ({
      session: prev.session,
      input: {
        queries: prev.input.queries.concat(next.input.queries),
        request: prev.input.request,
      },
    }),
    {
      session: providers[0].session,
      input: providers[0].input,
    }
  );

  const { session, input } = composedParams;

  return new SiteWiseTimeSeriesDataProvider(session, input);
};
