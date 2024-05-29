import { QueryKey } from '@tanstack/react-query';
import { isDurationViewport, parseDuration } from '@iot-app-kit/core';
import {
  GetAssetPropertyValueHistoryDataRequest,
  TimeSeriesRequestViewport,
} from './types';

export type TimeSeriesDataCacheRequestKeyShape = {
  assetId?: string;
  propertyId?: string;
  viewport?: {
    duration?: number | string;
    start?: number;
    end?: number;
    startOffset?: number;
    refreshRate?: number;
  };
};

export class TimeSeriesDataCacheKeyManager {
  #resource: string;

  #RequestsKey = 'time series data request';
  #RequestExectionKey = 'time series data request execution';
  #DataKey = 'time series data';

  constructor({ resource }: { resource: string }) {
    this.#resource = resource;
  }

  static deserializeViewport(
    serializedViewport: TimeSeriesDataCacheRequestKeyShape['viewport']
  ): TimeSeriesRequestViewport {
    if (!serializedViewport) {
      throw new Error('No viewport to deserialize');
    }

    if (serializedViewport.duration != null) {
      return {
        duration: serializedViewport.duration,
        startOffset: serializedViewport.startOffset,
        refreshRate: serializedViewport.refreshRate,
      };
    } else if (
      serializedViewport.start != null &&
      serializedViewport.end != null
    ) {
      return {
        start: new Date(serializedViewport.start),
        end: new Date(serializedViewport.end),
        startOffset: serializedViewport.startOffset,
        refreshRate: serializedViewport.refreshRate,
      };
    }

    throw new Error(
      'Viewport does not have the correct properties to deserialize'
    );
  }

  #serializeViewport(
    viewport: TimeSeriesRequestViewport
  ): TimeSeriesDataCacheRequestKeyShape['viewport'] {
    const offsetPartial = viewport.startOffset
      ? {
          startOffset: viewport.startOffset,
          refreshRate: viewport.refreshRate,
        }
      : {};

    if (isDurationViewport(viewport)) {
      return {
        ...offsetPartial,
        duration: parseDuration(viewport.duration),
      };
    }
    return {
      ...offsetPartial,
      start: viewport.start.getTime(),
      end: viewport.end.getTime(),
    };
  }

  #serializeRequestQuery(
    requestQuery: GetAssetPropertyValueHistoryDataRequest
  ): TimeSeriesDataCacheRequestKeyShape {
    return {
      assetId: requestQuery.assetId,
      propertyId: requestQuery.propertyId,
      viewport: this.#serializeViewport(requestQuery.viewport),
    };
  }

  /**
   *
   * @param requestQuery
   *
   * create query keys to map an incoming request query
   * to all of the request query keys that will be
   * given to the request functions. It is important
   * to cache these so that a request query always
   * maps to the same query keys.
   */
  toRequestQueryKey(
    requestQuery: GetAssetPropertyValueHistoryDataRequest
  ): QueryKey {
    return [
      {
        resource: [this.#resource, this.#RequestsKey],
        ...this.#serializeRequestQuery(requestQuery),
      },
    ] as const;
  }

  /**
   *
   * @param requestQuery
   *
   * create query keys for the requester functions to
   * use to execute the request function promises
   */
  toRequestExectutionQueryKey(
    requestQuery: GetAssetPropertyValueHistoryDataRequest
  ) {
    return [
      {
        resource: [this.#resource, this.#RequestExectionKey],
        ...this.#serializeRequestQuery(requestQuery),
      },
    ] as const;
  }

  /**
   *
   * @param requestQuery
   * @returns
   *
   * the key where all the data for time series data will live
   */
  toDataCacheQueryKey(
    requestQuery: GetAssetPropertyValueHistoryDataRequest
  ): QueryKey {
    return [
      {
        resource: [this.#resource, this.#DataKey],
        assetId: requestQuery.assetId,
        propertyId: requestQuery.propertyId,
      },
    ] as const;
  }

  /**
   *
   * @param queryKey
   *
   * deserialize a query key into the request query that generated it
   * This is an easier
   */
  toTimeSeriesDataRequestQuery(
    queryKey: QueryKey
  ): GetAssetPropertyValueHistoryDataRequest {
    const key = queryKey.at(0);

    if (!this.#isCorrectType(key)) {
      throw new Error('Key is not the correct type');
    } else if (!this.#isCorrectResource(key)) {
      throw new Error('Key does not apply to this resource');
    } else if (!this.#hasTimeSeriesDataRequestQueryInformation(key)) {
      throw new Error('Key does not have the correct properties');
    }

    const viewport = TimeSeriesDataCacheKeyManager.deserializeViewport(
      key.viewport
    );

    return {
      assetId: key.assetId,
      propertyId: key.propertyId,
      viewport,
    };
  }

  isTimeSeriesDataRequestQuery(
    queryKey: QueryKey
  ): queryKey is ReadonlyArray<TimeSeriesDataCacheRequestKeyShape> {
    const key = queryKey.at(0);
    return (
      this.#isCorrectType(key) &&
      this.#isCorrectResource(key) &&
      this.#hasTimeSeriesDataRequestQueryInformation(key)
    );
  }

  #isCorrectType(key: unknown): key is object {
    return typeof key === 'object' && key != null;
  }
  #isCorrectResource(key: object): key is { resource: string[] } {
    return (
      'resource' in key &&
      Array.isArray(key.resource) &&
      key.resource.includes(this.#resource) &&
      key.resource.includes(this.#RequestExectionKey)
    );
  }
  #hasTimeSeriesDataRequestQueryInformation(key: object): key is {
    assetId: string;
    propertyId: string;
    viewport: TimeSeriesDataCacheRequestKeyShape['viewport'];
  } {
    return (
      'assetId' in key &&
      typeof key.assetId === 'string' &&
      'propertyId' in key &&
      typeof key.propertyId === 'string' &&
      'viewport' in key &&
      typeof key.viewport === 'object' &&
      key.viewport != null &&
      (('duration' in key.viewport &&
        typeof key.viewport.duration === 'number') ||
        // need to handle duration viewport constraints
        ('start' in key.viewport &&
          typeof key.viewport.start === 'number' &&
          'end' in key.viewport &&
          typeof key.viewport.end === 'number'))
    );
  }
}
