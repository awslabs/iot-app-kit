import { TimeOrdering } from '@aws-sdk/client-iotsitewise';
import {
  type RequestResolverStrategy,
  type RequestSettings,
  type Viewport,
} from '../../useTimeSeriesData';
import { type AssetPropertyValuesRequest } from '../types';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';

const SITEWISE_PREVIEW_DATE = new Date(2018, 0, 1);

export class AssetPropertyValuesRequestResolver
  implements RequestResolverStrategy<AssetPropertyValuesRequest>
{
  #viewportResolverStrategy: RequestResolverStrategy<AssetPropertyValuesRequest>;
  constructor(
    viewportResolverStrategy: RequestResolverStrategy<AssetPropertyValuesRequest>
  ) {
    this.#viewportResolverStrategy = viewportResolverStrategy;
  }

  resolve(
    options: {
      request: AssetPropertyValuesRequest;
      viewport: Viewport;
    },
    settings?: RequestSettings | undefined
  ): { request: AssetPropertyValuesRequest; viewport: Viewport }[] {
    const resolved = this.#viewportResolverStrategy.resolve(options, settings);

    const { request, viewport } = options;

    if (settings?.fetchMostRecentBeforeEnd) {
      const mostRecentBeforeEndRequest: AssetPropertyValuesRequest = {
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
      const mostRecentBeforeStartRequest: AssetPropertyValuesRequest = {
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
