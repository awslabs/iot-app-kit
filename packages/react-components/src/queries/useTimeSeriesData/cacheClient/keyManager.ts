import { type QueryKey } from '@tanstack/react-query';
import { type FixedLengthArray } from 'type-fest';
import { type SeriaizedRequest, type Viewport } from '../types';

type TimeSeriesDataCacheKeyShape = FixedLengthArray<
  {
    resource: string;
    requestType: string;
    request: SeriaizedRequest;
    viewport?: Viewport;
  },
  1
>;

type TimeSeriesDataCacheKeyType = 'request' | 'execution' | 'data';

export abstract class TimeSeriesDataCacheKeyManager<Request> {
  #RequestsKey = 'DEDUPE_REQUESTS_time-series-data';
  #RequestExectionKey = 'EXECUTION_time-series-data';
  #DataKey = 'time-series-data';
  #CachedQueriesKey = 'CACHED_QUERIES_time-series-data';

  abstract RESOURCE: string;

  abstract serializeQueryExecutionRequest(request: Request): SeriaizedRequest;
  abstract serializeRequest(request: Request): SeriaizedRequest;
  abstract deserializeRequest(serializedRequest: SeriaizedRequest): Request;

  toRequestQueryKey(request: Request, viewport: Viewport): QueryKey {
    return [
      {
        resource: this.RESOURCE,
        requestType: this.#RequestsKey,
        request: this.serializeRequest(request),
        viewport,
      },
    ] as const;
  }

  toRequestExectutionQueryKey(request: Request, viewport: Viewport) {
    return [
      {
        resource: this.RESOURCE,
        requestType: this.#RequestExectionKey,
        request: this.serializeQueryExecutionRequest(request),
        viewport,
      },
    ] as const;
  }

  toCachedRequestExectutionQueryKey(request: Request) {
    return [
      {
        resource: this.RESOURCE,
        requestType: this.#CachedQueriesKey,
        request: this.serializeRequest(request),
      },
    ] as const;
  }

  toDataCacheQueryKey(request: Request) {
    return [
      {
        resource: this.RESOURCE,
        requestType: this.#DataKey,
        request: this.serializeRequest(request),
      },
    ] as const;
  }

  #toRequestType(cacheKeyType: TimeSeriesDataCacheKeyType) {
    if (cacheKeyType === 'request') {
      return this.#RequestsKey;
    } else if (cacheKeyType === 'execution') {
      return this.#RequestExectionKey;
    }
    return this.#DataKey;
  }

  toRequest(
    queryKey: QueryKey
  ): { request: Request; viewport?: Viewport } | undefined {
    if (!this.isTimeSeriesDataCacheKey(queryKey)) return undefined;

    return {
      request: this.deserializeRequest(queryKey[0].request),
      viewport: queryKey[0].viewport,
    };
  }

  isTimeSeriesDataQuery(
    queryKey: QueryKey,
    requestTypesToInclude: TimeSeriesDataCacheKeyType[] = [
      'request',
      'execution',
      'data',
    ]
  ): boolean {
    const types = requestTypesToInclude.map((type) =>
      this.#toRequestType(type)
    );
    return this.isTimeSeriesDataCacheKey(queryKey, types);
  }

  protected isTimeSeriesDataCacheKey(
    queryKey: QueryKey,
    requestTypesToMatch: string[] = [
      this.#RequestsKey,
      this.#RequestExectionKey,
      this.#DataKey,
    ]
  ): queryKey is TimeSeriesDataCacheKeyShape {
    const key = queryKey.at(0);
    return (
      // key is object
      key != null &&
      typeof key === 'object' &&
      // key is cache client key with resource
      'resource' in key &&
      typeof key.resource === 'string' &&
      key.resource === this.RESOURCE &&
      // key matches specific request type
      'requestType' in key &&
      typeof key.requestType === 'string' &&
      requestTypesToMatch.includes(key.requestType) &&
      // key has a serialized request object
      'request' in key &&
      key.request != null &&
      typeof key.request === 'object'
    );
  }
}
