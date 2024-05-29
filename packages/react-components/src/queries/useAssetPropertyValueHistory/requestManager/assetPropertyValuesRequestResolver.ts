import { TimeOrdering } from '@aws-sdk/client-iotsitewise';
import {
  RequestResolverStrategy,
  RequestSettings,
  Viewport,
} from '../../useTimeSeriesData';
import { AssetPropertyValueHistoryRequest } from '../types';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';

const SITEWISE_PREVIEW_DATE = new Date(2018, 0, 1);

export class AssetPropertyValuesRequestResolver
  implements RequestResolverStrategy<AssetPropertyValueHistoryRequest>
{
  #viewportResolverStrategy: RequestResolverStrategy<AssetPropertyValueHistoryRequest>;
  constructor(
    viewportResolverStrategy: RequestResolverStrategy<AssetPropertyValueHistoryRequest>
  ) {
    this.#viewportResolverStrategy = viewportResolverStrategy;
  }

  resolve(
    options: {
      request: AssetPropertyValueHistoryRequest;
      viewport: Viewport;
    },
    settings?: RequestSettings | undefined
  ): { request: AssetPropertyValueHistoryRequest; viewport: Viewport }[] {
    const resolved = this.#viewportResolverStrategy.resolve(options, settings);

    const { request, viewport } = options;

    if (settings?.fetchMostRecentBeforeEnd) {
      const mostRecentBeforeEndRequest: AssetPropertyValueHistoryRequest = {
        ...request,
        maxResults: 1,
        numberOfDataPointsToScanFor: 1,
        timeOrdering: TimeOrdering.DESCENDING,
      };
      const mostRecentBeforeEndViewport: Viewport = {
        start: SITEWISE_PREVIEW_DATE,
        end: viewportEndDate(viewport),
      };
      resolved.push({
        request: mostRecentBeforeEndRequest,
        viewport: mostRecentBeforeEndViewport,
      });
    }

    if (settings?.fetchMostRecentBeforeStart) {
      const mostRecentBeforeStartRequest: AssetPropertyValueHistoryRequest = {
        ...request,
        maxResults: 1,
        numberOfDataPointsToScanFor: 1,
        timeOrdering: TimeOrdering.DESCENDING,
      };
      const mostRecentBeforeStartViewport: Viewport = {
        start: SITEWISE_PREVIEW_DATE,
        end: viewportStartDate(viewport),
      };
      resolved.push({
        request: mostRecentBeforeStartRequest,
        viewport: mostRecentBeforeStartViewport,
      });
    }

    return resolved;
  }
}
