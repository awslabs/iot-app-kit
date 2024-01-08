import {
  DataRequest,
  Provider,
  ProviderObserver,
  DataBase,
  DataStreamBase,
} from '@iot-app-kit/core';
import { QueryClient, QueryObserver } from '@tanstack/query-core';

import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { getPropertyValueByEntity } from './client/getPropertyValueByEntity';
import { TwinMakerStaticDataQuery } from './types';

/**
 * Provider for TwinMaker time series data
 */
export class TwinMakerPropertyValueDataProvider
  implements Provider<DataBase[]>
{
  public tmClient: IoTTwinMakerClient;
  public queryClient: QueryClient;

  public observer: QueryObserver<
    DataBase[],
    unknown,
    DataBase[],
    DataBase[],
    TwinMakerStaticDataQuery[]
  >;

  private _unsubscribes: (() => void)[] = [];

  constructor(
    queryClient: QueryClient,
    tmClient: IoTTwinMakerClient,
    {
      request,
      queries,
    }: {
      request: DataRequest;
      queries: TwinMakerStaticDataQuery[];
    }
  ) {
    this.queryClient = queryClient;
    this.tmClient = tmClient;
    this.observer = new QueryObserver(queryClient, {
      queryKey: queries,
      queryFn: async () => {
        try {
          const promises: Promise<DataStreamBase[]>[] = [];
          queries.forEach((query) => {
            promises.push(
              getPropertyValueByEntity({ client: tmClient, query: query })
            );
          });
          return [{ dataStreams: (await Promise.all(promises)).flat() }];
        } catch (_err) {
          // TODO: return error
          return [];
        }
      },
      refetchInterval: request.settings?.refreshRate,
    });
  }

  subscribe = (observer: ProviderObserver<DataBase[]>) => {
    this._unsubscribes.push(
      this.observer.subscribe((result) => {
        if (result.data) {
          observer.next(result.data);
        }
      })
    );
  };

  unsubscribe = () => {
    this._unsubscribes.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
        const err = e as Error;

        // sometimes things get out of sync, if there's no subscription, then we don't need to do anything.
        if (err.message.includes('subscription does not exist.')) {
          return;
        }

        throw e;
      }
    });
  };
}
