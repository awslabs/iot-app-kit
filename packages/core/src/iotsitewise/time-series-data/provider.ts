import { MinimalViewPortConfig } from '@synchro-charts/core';
import { Provider, DataModule, IoTAppKitComponentSession } from '../../interface';
import {
  AnyDataStreamQuery,
  DataModuleSubscription,
  SubscriptionUpdate,
  DataStreamCallback,
} from '../../data-module/types';
import { SiteWiseAssetSession } from '../..';
import { subscribeToTimeSeriesData } from './coordinator';

export class SiteWiseTimeSeriesDataProvider
  implements
    Provider<DataModuleSubscription<AnyDataStreamQuery>, SubscriptionUpdate<AnyDataStreamQuery>, DataStreamCallback>
{
  private session: IoTAppKitComponentSession;
  private subscription: DataModuleSubscription<AnyDataStreamQuery>;
  private timeSeriesSession: DataModule;
  private assetModuleSession: SiteWiseAssetSession;
  private update: (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => void;

  constructor(
    session: IoTAppKitComponentSession,
    subscription: DataModuleSubscription<AnyDataStreamQuery>,
    timeSeriesSession: DataModule,
    assetModuleSession: SiteWiseAssetSession
  ) {
    this.session = session;
    this.subscription = subscription;
    this.timeSeriesSession = timeSeriesSession;
    this.assetModuleSession = assetModuleSession;
  }

  subscribe = (renderFunc: DataStreamCallback) => {
    const { update } = subscribeToTimeSeriesData(this.timeSeriesSession, this.assetModuleSession)(
      this.subscription,
      renderFunc
    );
    this.update = update;
  };

  updateSubscription = (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => {
    this.update(subscriptionUpdate);
  };

  unsubscribe = () => {
    this.session.close();
  };

  getViewport = () => {
    return this.subscription.request.viewport;
  };

  updateViewport = (viewport: MinimalViewPortConfig) => {
    this.subscription = {
      ...this.subscription,
      request: {
        ...this.subscription.request,
        viewport,
      },
    };

    this.update({
      request: {
        ...this.subscription.request,
        viewport,
      },
    });
  };
}
