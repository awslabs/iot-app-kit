import { AppKitComponentSession, Provider } from '../types';
import { DataStreamQuery, DataModuleSubscription, DataStreamCallback } from '../../data-module/types';
import { DataModules } from './dataModules';

/**
 * Set of Query's that can be used in an app kit component
 * Query returns the appropriate component session and calling subscribe() on it
 * accepts a renderFunc to be used to render component data
 */
export namespace query.iotsitewise {
  export function timeSeriesData<Query extends DataStreamQuery>(
    session: AppKitComponentSession,
    query: DataModuleSubscription<Query>
  ): Provider<DataStreamCallback> {
    // 1. get sitewise data module singleton
    // 2. store session and query information in closure to call renderFunc with
    // This let's end-users do:
    //      query = query.iotsitewise.timeSeriesData(session, query)
    //      query.subscribe(); // push data to visualizations
    const siteWiseIotDataModule = DataModules.siteWiseIotData(session);

    return {
      subscribe: (renderFunc: DataStreamCallback) => siteWiseIotDataModule.subscribe(query, renderFunc),
    };
  }
}
