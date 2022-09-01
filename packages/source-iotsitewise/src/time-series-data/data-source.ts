import { IoTSiteWiseClient, AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseDataSourceSettings, SiteWiseDataStreamQuery } from './types';
import { SiteWiseClient } from './client/client';
import { toId } from './util/dataStreamId';
import {
  ResolutionConfig,
  DataSource,
  MINUTE_IN_MS,
  HOUR_IN_MS,
  DAY_IN_MS,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import { SupportedResolutions } from './util/resolution';

const DEFAULT_RESOLUTION_MAPPING = {
  [MINUTE_IN_MS * 15]: SupportedResolutions.ONE_MINUTE,
  [HOUR_IN_MS * 15]: SupportedResolutions.ONE_HOUR,
  [DAY_IN_MS * 60]: SupportedResolutions.ONE_DAY,
};

const isSiteWiseResolution = (resolution: string | SupportedResolutions): resolution is SupportedResolutions => {
  return Object.values(SupportedResolutions).includes(resolution as SupportedResolutions);
};

export const determineResolution = ({
  resolution,
  start,
  end,
}: {
  resolution?: ResolutionConfig;
  start: Date;
  end: Date;
}): string => {
  if (typeof resolution === 'string') {
    return resolution;
  }

  const resolutionOverride = resolution || DEFAULT_RESOLUTION_MAPPING;
  const viewportTimeSpan = end.getTime() - start.getTime();

  const matchedViewport = Object.keys(resolutionOverride)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .find((viewport) => viewportTimeSpan >= parseInt(viewport));

  if (matchedViewport) {
    const matchedResolution = resolutionOverride[parseInt(matchedViewport)] as string;

    if (!isSiteWiseResolution(matchedResolution)) {
      throw new Error(
        `${matchedResolution} is not a valid SiteWise aggregation resolution, must match regex pattern '1m|1h|1d'`
      );
    }

    return matchedResolution;
  } else {
    return '0';
  }
};

export const createDataSource = (
  siteWise: IoTSiteWiseClient,
  settings?: SiteWiseDataSourceSettings
): DataSource<SiteWiseDataStreamQuery> => {
  const client = new SiteWiseClient(siteWise, settings);
  return {
    initiateRequest: ({ onSuccess, onError }, requestInformations) =>
      Promise.all([
        client.getLatestPropertyDataPoint({ onSuccess, onError, requestInformations }),
        client.getAggregatedPropertyDataPoints({
          requestInformations,
          onSuccess,
          onError,
          aggregateTypes: [AggregateType.AVERAGE],
        }),
        client.getHistoricalPropertyDataPoints({ requestInformations, onSuccess, onError }),
      ]),
    getRequestsFromQuery: async ({ query, request }) => {
      const resolution = determineResolution({
        resolution: request.settings?.resolution,
        start: viewportStartDate(request.viewport),
        end: viewportEndDate(request.viewport),
      });

      return query.assets.flatMap(({ assetId, properties }) =>
        properties.map(({ propertyId, resolution: resolutionOverride, refId }) => ({
          id: toId({ assetId, propertyId }),
          refId,
          resolution: resolutionOverride != null ? resolutionOverride : resolution,
        }))
      );
    },
  };
};
