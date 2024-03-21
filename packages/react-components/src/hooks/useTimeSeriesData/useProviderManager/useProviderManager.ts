import type {
  Viewport,
  TimeSeriesData,
  TimeSeriesDataRequest,
  TimeQuery,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';
import { useEffect, useMemo } from 'react';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import useUnmount from 'react-use/lib/useUnmount';
import { v4 as uuid } from 'uuid';

import { ProviderManager, type HashableQuery } from '../providerManager';

interface UseProviderManagerOptions {
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  viewport: Viewport;
  settings: TimeSeriesDataRequestSettings;
  onData: Parameters<ProviderManager['subscribeAll']>[0]['observer']['next'];
}

type UseProviderManagerResult = void;

/** Use for lifecycle management of providers. */
export function useProviderManager({
  queries,
  viewport,
  settings,
  onData,
}: UseProviderManagerOptions): UseProviderManagerResult {
  const providerManager = useMemo(() => new ProviderManager(), []);
  const queryStrings = queries.map((query) => query.toQueryString());
  const parsedQueries: HashableQuery[] = queryStrings.map((queryString) => [
    JSON.parse(queryString).query,
  ]);

  // Initiate subscriptions when
  useEffect(() => {
    // Replace the providers if the queries are new.
    if (providerManager.shouldReplaceProviders(parsedQueries)) {
      const providers = queries.map((query) => {
        const providerId = uuid();
        const provider = query.build(providerId, { viewport, settings });

        return provider;
      });

      providerManager.subscribeAll({
        providers,
        observer: {
          next: onData,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryStrings.join()]);

  // Unsubscribe all providers on unmount.
  useUnmount(() => providerManager.unsubscribeAll());

  // Update viewport when there is a change.
  useUpdateEffect(
    () => providerManager.updateAllViewports(viewport),
    [viewport ?? {}]
  );
}
