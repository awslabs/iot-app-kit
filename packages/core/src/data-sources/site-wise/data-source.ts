import { IoTSiteWiseClient, AggregateType } from '@aws-sdk/client-iotsitewise';
import { DataSource } from '../../data-module/types.d';
import { SiteWiseDataStreamQuery } from './types.d';
import { SiteWiseClient } from './client/client';
import { toDataStreamId } from './util/dataStreamId';
import { viewportEndDate, viewportStartDate } from '../../common/viewport';
import { ResolutionMapping } from '../../data-module/data-cache/requestTypes';
import { MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS } from '../../common/time';
import { RESOLUTION_TO_MS_MAPPING, SupportedResolutions } from './util/resolution';

export const SITEWISE_DATA_SOURCE = 'site-wise';

const DEFAULT_RESOLUTION_MAPPING = {
  [MINUTE_IN_MS]: SupportedResolutions.ONE_MINUTE,
  [HOUR_IN_MS]: SupportedResolutions.ONE_HOUR,
  [DAY_IN_MS]: SupportedResolutions.ONE_DAY,
}

const isSiteWiseResolution = (resolution: string | SupportedResolutions): resolution is SupportedResolutions => {
  return Object.values(SupportedResolutions).includes(resolution as SupportedResolutions);
}

export const determineResolution = ({
  resolutionMapping,
  fetchAggregatedData = false,
  start,
  end
}: {
  resolutionMapping?: ResolutionMapping;
  fetchAggregatedData?: boolean,
  start: Date;
  end: Date;
}): string => {
    // by default request raw data
    let resolution = '0';

    if (fetchAggregatedData) {
      const viewportTimeSpan = end.getTime() - start.getTime();

      const resolutionMappingOverride = resolutionMapping || DEFAULT_RESOLUTION_MAPPING;

      const matchedViewport = Object.keys(resolutionMappingOverride)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .find(viewport => viewportTimeSpan >= parseInt(viewport));

      if (matchedViewport) {
        resolution = resolutionMappingOverride[parseInt(matchedViewport)] as string;

        if (!isSiteWiseResolution(resolution)) {
          throw new Error(`${resolution} is not a valid SiteWise aggregation resolution, must match regex pattern '1m|1h|1d'`);
        }
      }
    }

    return resolution;
}

export const createDataSource = (siteWise: IoTSiteWiseClient): DataSource<SiteWiseDataStreamQuery> => {
  const client = new SiteWiseClient(siteWise);
  return {
    name: SITEWISE_DATA_SOURCE,
    initiateRequest: ({ query, requestInfo, onSuccess, onError }) => {
      if (requestInfo.onlyFetchLatestValue) {
        return client.getLatestPropertyDataPoint({ query, onSuccess, onError });
      }

      const start = viewportStartDate(requestInfo.viewport);
      const end = viewportEndDate(requestInfo.viewport);

      const resolution = determineResolution({
        resolutionMapping: requestInfo.requestConfig?.resolutionMapping,
        fetchAggregatedData: requestInfo.requestConfig?.fetchAggregatedData,
        start,
        end
      });

      if (resolution !== '0') {
        // TODO: Support multiple aggregations
        const aggregateTypes = [AggregateType.AVERAGE];

        return client.getAggregatedPropertyDataPoints({
          query,
          onSuccess,
          onError,
          start,
          end,
          resolution,
          aggregateTypes
        });
      }

      return client.getHistoricalPropertyDataPoints({ query, onSuccess, onError, start, end });
    },
    getRequestsFromQuery: ({ query, requestInfo }) => {
      const start = viewportStartDate(requestInfo.viewport);
      const end = viewportEndDate(requestInfo.viewport);

      const resolution = determineResolution({
        resolutionMapping: requestInfo.requestConfig?.resolutionMapping,
        fetchAggregatedData: requestInfo.requestConfig?.fetchAggregatedData,
        start,
        end
      });

      return query.assets.flatMap(({assetId, propertyIds}) =>
        propertyIds.map((propertyId) => ({
          id: toDataStreamId({assetId, propertyId}),
          resolution: RESOLUTION_TO_MS_MAPPING[resolution],
        }))
      );
    },
  };
};
