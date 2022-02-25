import { IoTSiteWiseClient, AggregateType } from '@aws-sdk/client-iotsitewise';
import { PropertyQuery, SiteWiseAssetDataStreamQuery, SiteWiseDataStreamQuery } from './types';
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
import { RESOLUTION_TO_MS_MAPPING, SupportedResolutions } from './util/resolution';

export const SITEWISE_DATA_SOURCE = 'site-wise';

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
  if (resolution != null && resolution !== '0') {
    const viewportTimeSpan = end.getTime() - start.getTime();

    const resolutionOverride = resolution || DEFAULT_RESOLUTION_MAPPING;

    if (typeof resolutionOverride === 'string') {
      return resolutionOverride;
    }

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
    }
  }

  return '0';
};

const separateDataQueries = (
  query: SiteWiseDataStreamQuery
): {
  aggregatedDataQueries?: SiteWiseAssetDataStreamQuery;
  rawDataQueries?: SiteWiseAssetDataStreamQuery;
  defaultResolutionDataQueries?: SiteWiseAssetDataStreamQuery;
} => {
  let aggregatedDataQueries: SiteWiseAssetDataStreamQuery | undefined;
  let rawDataQueries: SiteWiseAssetDataStreamQuery | undefined;
  let defaultResolutionDataQueries: SiteWiseAssetDataStreamQuery | undefined;

  query.assets.forEach(({ assetId, properties }) => {
    let aggregatedDataProperties: PropertyQuery[] | undefined;
    let rawDataProperties: PropertyQuery[] | undefined;
    let defaultResolutionDataProperties: PropertyQuery[] | undefined;

    properties.forEach(({ propertyId, resolution }) => {
      if (resolution === '0') {
        if (!rawDataProperties) {
          rawDataProperties = [{ propertyId, resolution }];
        } else {
          rawDataProperties.push({ propertyId, resolution });
        }
      } else if (typeof resolution === 'string' && isSiteWiseResolution(resolution)) {
        if (!aggregatedDataProperties) {
          aggregatedDataProperties = [{ propertyId, resolution }];
        } else {
          aggregatedDataProperties.push({ propertyId, resolution });
        }
      } else {
        if (!defaultResolutionDataProperties) {
          defaultResolutionDataProperties = [{ propertyId, resolution }];
        } else {
          defaultResolutionDataProperties.push({ propertyId, resolution });
        }
      }
    });

    if (aggregatedDataProperties) {
      if (!aggregatedDataQueries) {
        aggregatedDataQueries = { ...query, assets: [{ assetId, properties: aggregatedDataProperties }] };
      } else {
        aggregatedDataQueries.assets.push({ assetId, properties: aggregatedDataProperties });
      }
    }

    if (rawDataProperties) {
      if (!rawDataQueries) {
        rawDataQueries = { ...query, assets: [{ assetId, properties: rawDataProperties }] };
      } else {
        rawDataQueries.assets.push({ assetId, properties: rawDataProperties });
      }
    }

    if (defaultResolutionDataProperties) {
      if (!defaultResolutionDataQueries) {
        defaultResolutionDataQueries = { ...query, assets: [{ assetId, properties: defaultResolutionDataProperties }] };
      } else {
        defaultResolutionDataQueries.assets.push({ assetId, properties: defaultResolutionDataProperties });
      }
    }
  });

  return { rawDataQueries, aggregatedDataQueries, defaultResolutionDataQueries };
};

export const createDataSource = (siteWise: IoTSiteWiseClient): DataSource<SiteWiseDataStreamQuery> => {
  const client = new SiteWiseClient(siteWise);
  return {
    name: SITEWISE_DATA_SOURCE,
    initiateRequest: ({ query, request, onSuccess, onError }, requestInformations) => {
      if (request.settings?.fetchMostRecentBeforeEnd) {
        return client.getLatestPropertyDataPoint({ query, onSuccess, onError, requestInformations });
      }

      const resolution = determineResolution({
        resolution: request.settings?.resolution,
        start: viewportStartDate(request.viewport),
        end: viewportEndDate(request.viewport),
      });

      const { aggregatedDataQueries, rawDataQueries, defaultResolutionDataQueries } = separateDataQueries(query);

      const requests = [];

      // TODO: Support multiple aggregations
      const aggregateTypes = [AggregateType.AVERAGE];

      if (aggregatedDataQueries) {
        requests.push(() =>
          client.getAggregatedPropertyDataPoints({
            query: aggregatedDataQueries,
            requestInformations,
            onSuccess,
            onError,
            resolution,
            aggregateTypes,
          })
        );
      }

      if (rawDataQueries) {
        requests.push(() =>
          client.getHistoricalPropertyDataPoints({ query: rawDataQueries, requestInformations, onSuccess, onError })
        );
      }

      if (defaultResolutionDataQueries) {
        if (resolution !== '0') {
          requests.push(() =>
            client.getAggregatedPropertyDataPoints({
              query: defaultResolutionDataQueries,
              requestInformations,
              onSuccess,
              onError,
              resolution,
              aggregateTypes,
            })
          );
        } else {
          requests.push(() =>
            client.getHistoricalPropertyDataPoints({
              query: defaultResolutionDataQueries,
              requestInformations,
              onSuccess,
              onError,
            })
          );
        }
      }

      return Promise.all(requests.map(async (request) => request()));
    },
    getRequestsFromQuery: ({ query, request }) => {
      const resolution = determineResolution({
        resolution: request.settings?.resolution,
        start: viewportStartDate(request.viewport),
        end: viewportEndDate(request.viewport),
      });

      return query.assets.flatMap(({ assetId, properties }) =>
        properties.map(({ propertyId, resolution: resolutionOverride, refId }) => ({
          id: toId({ assetId, propertyId }),
          refId,
          resolution: RESOLUTION_TO_MS_MAPPING[resolutionOverride || resolution],
        }))
      );
    },
  };
};
