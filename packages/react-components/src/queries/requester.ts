import {
  Viewport,
  isDurationViewport,
  parseDuration,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import { QueryClient, Query, QueryKey } from '@tanstack/react-query';
// import { queryClient } from "./queryClient";
import { createNonNullableList } from '../utils/createNonNullableList';

export type RequestQuery = {
  assetId: string;
  propertyId: string;
  viewport: Viewport;
};

export type PartialRequestQuery = Partial<RequestQuery>;

export type RequestQueries = Partial<RequestQuery>[];
export type RequiredRequestQueries = RequestQuery[];

export type CacheQueryKeyShape = {
  resource?: string;
  assetId?: string;
  propertyId?: string;
  viewport?: {
    duration?: number;
    start?: number;
    end?: number;
  };
};
export type CacheQueryKey = ReadonlyArray<CacheQueryKeyShape>;

export const isValidRequestQuery = (
  query: PartialRequestQuery
): query is RequestQuery => {
  return (
    query.assetId != null &&
    query.assetId.length > 0 &&
    query.propertyId != null &&
    query.propertyId.length > 0 &&
    query.viewport != null
  );
};

export class TanstackCacheAdapter {
  #resource: string;
  constructor(resource: string) {
    this.#resource = resource;
  }

  #deserializeViewport(
    queryViewport: CacheQueryKeyShape['viewport']
  ): Viewport | undefined {
    if (!queryViewport) {
      return undefined;
    } else if (queryViewport.duration != null) {
      return {
        duration: queryViewport.duration,
      };
    } else if (queryViewport.start != null && queryViewport.end != null) {
      return {
        start: new Date(queryViewport.start),
        end: new Date(queryViewport.end),
      };
    }
    return undefined;
  }
  #serializeViewport(viewport: Viewport) {
    if (isDurationViewport(viewport)) {
      return {
        duration: parseDuration(viewport.duration),
      };
    }
    return {
      start: viewport.start.getTime(),
      end: viewport.end.getTime(),
    };
  }

  toQueryKey(requestQuery: RequestQuery): CacheQueryKey {
    return [
      {
        resource: this.#resource,
        assetId: requestQuery.assetId,
        propertyId: requestQuery.propertyId,
        viewport: this.#serializeViewport(requestQuery.viewport),
      },
    ] as const;
  }

  toRequestQuery(queryKey: CacheQueryKey): RequestQuery | undefined {
    const query = queryKey.at(0);
    if (
      query?.assetId == null ||
      query.propertyId == null ||
      query.viewport == null
    )
      return;
    const viewport = this.#deserializeViewport(query.viewport);
    if (viewport == null) return;
    return {
      assetId: query.assetId,
      propertyId: query.propertyId,
      viewport,
    };
  }
}

export class TanstackCache {
  #queryClient: QueryClient;
  constructor(queryClient: QueryClient) {
    this.#queryClient = queryClient;
  }

  filterCachedQueries<Key, Value>(predicate: (query: Query) => boolean) {
    // not sure of a better way to ensure typing here...
    return this.#queryClient.getQueriesData({ predicate }) as [Key, Value][];
  }

  filterCachedQueryKeys<Key>(predicate: (queryKey: QueryKey) => boolean) {
    return this.filterCachedQueries<Key, unknown>((query) =>
      predicate(query.queryKey)
    ).map(([key]) => key);
  }

  #serializeViewport(viewport: Viewport) {
    if (isDurationViewport(viewport)) {
      return {
        duration: parseDuration(viewport.duration),
      };
    }
    return {
      start: viewport.start.getTime(),
      end: viewport.end.getTime(),
    };
  }

  #deserializeViewport(
    queryViewport: CacheQueryKeyShape['viewport']
  ): Viewport | undefined {
    if (!queryViewport) {
      return undefined;
    } else if (queryViewport.duration != null) {
      return {
        duration: queryViewport.duration,
      };
    } else if (queryViewport.start != null && queryViewport.end != null) {
      return {
        start: new Date(queryViewport.start),
        end: new Date(queryViewport.end),
      };
    }
    return undefined;
  }

  generateQueryKey(requestQuery: RequestQuery): CacheQueryKey {
    const resource = RESOURCE;
    // console.log(requestQuery.viewport);
    const viewport = this.#serializeViewport(requestQuery.viewport);
    return [
      {
        resource: resource,
        assetId: requestQuery.assetId,
        propertyId: requestQuery.propertyId,
        viewport,
      },
    ] as const;
  }

  getExistingQuerys(requestQuery: RequestQuery) {
    const { assetId, propertyId, viewport } = requestQuery;
    const resource = RESOURCE;
    const requestQueryStart = viewportStartDate(viewport).getTime();
    const requestQueryEnd = viewportEndDate(viewport).getTime();
    return createNonNullableList(
      this.#queryClient.getQueriesData({
        predicate: (query) => {
          const key = query.queryKey.at(0);
          return (
            typeof key === 'object' &&
            key != null &&
            'resource' in key &&
            key.resource === resource &&
            'assetId' in key &&
            typeof key.assetId === 'string' &&
            key.assetId === assetId &&
            'propertyId' in key &&
            typeof key.propertyId === 'string' &&
            key.propertyId === propertyId &&
            'viewport' in key &&
            typeof key.viewport === 'object' &&
            key.viewport != null &&
            (('duration' in key.viewport &&
              typeof key.viewport.duration === 'number') ||
              // need to handle duration viewport constraints
              ('start' in key.viewport &&
                typeof key.viewport.start === 'number' &&
                'end' in key.viewport &&
                typeof key.viewport.end === 'number' &&
                ((key.viewport.start >= requestQueryStart &&
                  key.viewport.start <= requestQueryEnd) ||
                  (key.viewport.end >= requestQueryStart &&
                    key.viewport.end <= requestQueryEnd) ||
                  (key.viewport.start <= requestQueryStart &&
                    key.viewport.end >= requestQueryEnd))))
          );
        },
      })
    );
  }

  getExistingQueryRequests(requestQuery: RequestQuery): RequestQuery[] {
    const { assetId, propertyId, viewport } = requestQuery;
    const resource = RESOURCE;
    const requestQueryStart = viewportStartDate(viewport).getTime();
    const requestQueryEnd = viewportEndDate(viewport).getTime();
    return createNonNullableList(
      this.#queryClient
        .getQueriesData({
          predicate: (query) => {
            const key = query.queryKey.at(0);
            return (
              typeof key === 'object' &&
              key != null &&
              'resource' in key &&
              key.resource === resource &&
              'assetId' in key &&
              typeof key.assetId === 'string' &&
              key.assetId === assetId &&
              'propertyId' in key &&
              typeof key.propertyId === 'string' &&
              key.propertyId === propertyId &&
              'viewport' in key &&
              typeof key.viewport === 'object' &&
              key.viewport != null &&
              (('duration' in key.viewport &&
                typeof key.viewport.duration === 'number') ||
                // need to handle duration viewport constraints
                ('start' in key.viewport &&
                  typeof key.viewport.start === 'number' &&
                  'end' in key.viewport &&
                  typeof key.viewport.end === 'number' &&
                  ((key.viewport.start >= requestQueryStart &&
                    key.viewport.start <= requestQueryEnd) ||
                    (key.viewport.end >= requestQueryStart &&
                      key.viewport.end <= requestQueryEnd) ||
                    (key.viewport.start <= requestQueryStart &&
                      key.viewport.end >= requestQueryEnd))))
            );
          },
        })
        .map(([queryKey]) => {
          // probably need a better way to narrow this...
          const key = queryKey.at(0) as CacheQueryKeyShape;
          if (
            key?.assetId == null ||
            key.propertyId == null ||
            key.viewport == null
          )
            return;
          const viewport = this.#deserializeViewport(key.viewport);
          if (viewport == null) return;
          return {
            assetId: key.assetId,
            propertyId: key.propertyId,
            viewport,
          };
        })
    ).sort((a, b) => {
      return (
        viewportStartDate(a.viewport).getTime() -
        viewportStartDate(b.viewport).getTime()
      );
    });
  }
}

// export class RequestQueryBuilder {
//   #requestQuery: RequestQuery;

//   constructor(requestQuery: RequestQuery) {
//     this.#requestQuery = requestQuery;
//   }

// }

const startsBefore = (a: Viewport, b: Viewport) => {
  return viewportStartDate(a).getTime() < viewportStartDate(b).getTime();
};
const endsAfter = (a: Viewport, b: Viewport) => {
  return viewportEndDate(a).getTime() > viewportEndDate(b).getTime();
};

export const completeQueryRequests = (
  requestQuery: RequestQuery,
  requestQueriesContext: RequestQuery[]
): RequestQuery[] => {
  if (requestQueriesContext.length === 0) {
    return [requestQuery];
  }

  const queryRequests = [];

  // fill in first
  const firstRequest = requestQueriesContext.at(0);
  if (
    firstRequest &&
    startsBefore(requestQuery.viewport, firstRequest.viewport)
  ) {
    queryRequests.push({
      ...requestQuery,
      viewport: {
        start: viewportStartDate(requestQuery.viewport),
        end: viewportStartDate(firstRequest.viewport),
      },
    });
  }

  // fill in existing
  queryRequests.push(...requestQueriesContext);

  // fill in last
  const lastRequest = requestQueriesContext.at(-1);
  if (lastRequest && endsAfter(requestQuery.viewport, lastRequest.viewport)) {
    queryRequests.push({
      ...requestQuery,
      viewport: {
        start: viewportEndDate(lastRequest.viewport),
        end: viewportEndDate(requestQuery.viewport),
      },
    });
  }

  const missingQueryRequests = [];

  // fill in holes
  for (let i = 1; i < queryRequests.length; i++) {
    const lastKey = queryRequests[i - 1];
    const currentKey = queryRequests[i];

    if (
      viewportEndDate(lastKey.viewport) < viewportStartDate(currentKey.viewport)
    ) {
      missingQueryRequests.push({
        ...requestQuery,
        viewport: {
          start: viewportEndDate(lastKey.viewport),
          end: viewportStartDate(currentKey.viewport),
        },
      });
    }
  }

  return [...queryRequests, ...missingQueryRequests].sort((a, b) => {
    return (
      viewportStartDate(a.viewport).getTime() -
      viewportStartDate(b.viewport).getTime()
    );
  });
};

const RESOURCE = 'AssetPropertyValueHistory';

// const run = (requestQueries: RequestQueries) => {
//   // const adapter = new TanstackCacheAdapter(RESOURCE)
//   const cache = new TanstackCache(queryClient);
//   const queryRequests = requestQueries
//     .filter(isValidRequestQuery)
//     .map(requestQuery => {
//       const existing = cache.getExistingQueryRequests(requestQuery);
//       const completed = completeQueryRequests(requestQuery, existing);
//       return completed;
//     });

//   const keys = queryRequests.flatMap(requests => requests.map(cache.generateQueryKey));

//   // const cachedRequestQueries = cachedKeys.map(adapter.toRequestQuery);

// };

// const isCorrectShape = (key: unknown): key is object => typeof key === 'object' && key != null;
// const isCorrectResource = (key: object, resource: string): key is { resource: string } => 'resource' in key && key.resource === resource;
// const isCorrectRequestQuery = (key: object, requestQuery: RequestQuery) => {
//   return 'assetId' in key && typeof key.assetId === 'string' && key.assetId === requestQuery.assetId &&
//     'propertyId' in key && typeof key.propertyId === 'string' && key.propertyId === requestQuery.propertyId;
// };
// const isRelevantInterval = (key: object, requestQuery: RequestQuery) => {

// };

// const isAssetPropertyValueHistoryQueryKey = (requestQuery: RequestQuery) => (queryKey: QueryKey): queryKey is CacheQueryKey => {
//   const key = queryKey.at(0);
//   return isCorrectShape(key) && isCorrectResource(key, RESOURCE) && isCorrectRequestQuery(key, requestQuery) && isRelevantInterval(key, requestQuery);
// };

/**
 * cache
 * 1. getExistingQueryRequests
 * 2. generateQueryKeys
 */

// const run = (requestQueries: RequestQueries) => {
//   const adapter = new TanstackCacheAdapter(RESOURCE)
//   const cache = new TanstackCache(queryClient);
//   const cachedRequestQueries = requestQueries.filter(isValidRequestQuery).flatMap(
//     requestQuery => {
//       const cachedQueryKeysForResource = cache.filterCachedQueryKeys<CacheQueryKey>(
//         queryKey => {
//           const key = queryKey.at(0);
//           return isCorrectShape(key) && isCorrectResource(key, RESOURCE);
//         }
//       );
//       const cachedRequestQueries = createNonNullableList(cachedQueryKeysForResource.map(adapter.toRequestQuery));
//       return cachedRequestQueries.filter(cachedRequestQuery => {
//         return isCorrectRequestQuery(cachedRequestQuery, requestQuery) && isRelevantInterval(cachedRequestQuery, requestQuery)
//       })
//     }
//   );

// };

// const isCorrectShape = (key: unknown): key is object => typeof key === 'object' && key != null;
// const isCorrectResource = (key: object, resource: string): key is { resource: string } => 'resource' in key && key.resource === resource;
// const isCorrectRequestQuery = (key: RequestQuery, requestQuery: RequestQuery) => {
//   return key.assetId === requestQuery.assetId && key.propertyId === requestQuery.propertyId;
// };
// const isRelevantInterval = ({ viewport: keyViewport }: RequestQuery, { viewport: requestViewport }: RequestQuery) => {
//   const viewportStart = viewportStartDate(requestViewport);
//   const viewportEnd = viewportEndDate(requestViewport);

//   const keyViewportStart = viewportStartDate(keyViewport);
//   const keyViewportEnd = viewportEndDate(keyViewport);

//   return (keyViewportStart >= viewportStart && keyViewportStart <= viewportEnd) ||
//         (keyViewportEnd >= viewportStart && keyViewportEnd <= viewportEnd) ||
//         (keyViewportStart <= viewportStart && keyViewportEnd >= viewportEnd);
// };

// export class Requester {
//   #requestQueries: RequestQueries;
//   #validRequestQueries: RequiredRequestQueries;

//   constructor(requestQueries: RequestQueries) {
//     this.#requestQueries = requestQueries;
//   }

//   #isValidRequestQuery (query: Partial<RequestQuery>): query is RequestQuery {
//     return query.assetId != null && query.assetId.length > 0 && query.propertyId != null && query.propertyId.length > 0 && query.viewport != null ;
//   }

//   createRequests () {}
// }
