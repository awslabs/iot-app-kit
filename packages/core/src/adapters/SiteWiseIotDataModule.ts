import { DataStreamQuery, DataStreamCallback, DataModuleSubscription } from '../data-module/types';
import { AppKitComponentSession } from './types';
import { SubscriptionResponse } from '../interface';
import { Credentials, Provider } from '@aws-sdk/types';
import { initialize } from '..';
import { SiteWiseIotDataSession } from './SiteWiseIotDataSession';

/**
 * Handles creating at most one data session per component session.
 */
export class SiteWiseIotDataModule<Query extends DataStreamQuery> {
  private dataModule;
  private sessionMap: { [key: string]: SiteWiseIotDataSession<Query> } = {};

  constructor({
    awsCredentials,
    awsRegion = 'us-east-1',
  }: {
    awsCredentials: Credentials | Provider<Credentials>;
    awsRegion?: string;
  }) {
    this.dataModule = initialize({ awsCredentials, awsRegion });
  }

  getSession(session: AppKitComponentSession): SiteWiseIotDataSession<Query> {
    if (this.sessionMap[session.componentId]) {
      return this.sessionMap[session.componentId];
    }

    // Sessions only differ by their metric clients for now. 1 metric client per component:module combination
    const siteWiseSession = new SiteWiseIotDataSession(this, session.getSessionMetrics(this.constructor.name));
    session.attachDataModuleSession(siteWiseSession);
    this.sessionMap[session.componentId] = siteWiseSession;
    return siteWiseSession;
  }

  subscribeToDataStreams<Query extends DataStreamQuery>(
    subscription: DataModuleSubscription<Query>,
    callback: DataStreamCallback
  ): SubscriptionResponse<Query> {
    return this.dataModule.subscribeToDataStreams(subscription, callback);
  }
}
