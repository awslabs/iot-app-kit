import { QueryBuilder } from '../types';
import {
  AnyDataStreamQuery,
  DataModuleSubscription,
  SubscriptionUpdate,
  DataStreamCallback,
} from '../../data-module/types';
import { datamodule } from './dataModules';

/**
 * Namespace containing QueryBuilder functions that return Query instances
 * Query returns data via subscription through renderFunc
 */
export namespace query.iotsitewise {
  export const timeSeriesData: QueryBuilder<
    DataModuleSubscription<AnyDataStreamQuery>,
    SubscriptionUpdate<AnyDataStreamQuery>,
    DataStreamCallback
  > = (params) => {
    return {
      params,
      build: (session, props) => {
        let decoratedParams = params;

        // decorate params with viewport for sitewise queries
        if (props?.viewport) {
          decoratedParams = {
            ...params,
            request: {
              ...params.request,
              viewport: props?.viewport,
            },
          };
        }

        // 1. get sitewise data module singleton
        // 2. store session and query information in closure to call renderFunc with
        // This let's end-users do:
        //      query = query.iotsitewise.timeSeriesData(query)
        //      query.build(session).subscribe(renderFunc); // push data to visualizations
        const siteWiseIotDataSession = datamodule.iotsitewise.timeSeriesData(session);

        return {
          // updateViewport: () => {}
          // Provider smart enough to handle multiple subscriptions, Session only allows you to subscribe
          // this is smarter, session is dumber
          subscribe: (renderFunc: DataStreamCallback) => siteWiseIotDataSession.subscribe(decoratedParams, renderFunc),
          updateSubscription: (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) =>
            siteWiseIotDataSession.updateSubscription(subscriptionUpdate),
          unsubscribe: () => siteWiseIotDataSession.close(),
        };
      },
    };
  };
}
