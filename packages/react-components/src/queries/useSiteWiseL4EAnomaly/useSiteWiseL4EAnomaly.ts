import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { HistoricalViewport } from '@iot-app-kit/core';
import { sub } from 'date-fns';
import { useDescribeAssetModelCompositeModel } from '../useDescribeAssetModelCompositeModel';
import { useGetAssetPropertyValueHistory } from '../useGetAssetPropertyValueHistory';
import { useDescribeAsset } from '../useDescribeAsset';
import { useDescribeAssetProperties } from '../useDescribeAssetProperties';
import { getAnomalyResultProperty } from './getAnomalyResultProperty';
import { parseAnomalyEvents } from './parseAnomaly/parseAnomalyEvents';
import { extractDiagnoticProperties } from './parseAnomaly/extractDiagnoticProperties';

const DEFAULT_VIEWPORT = {
  start: sub(Date.now(), { days: 7 }),
  end: new Date(),
};

export type SiteWiseL4EAnomalyOptions = {
  client: IoTSiteWiseClient;
  assetId?: string;
  predictionDefinitionId?: string;
  viewport?: HistoricalViewport;
};

export const useSiteWiseL4EAnomaly = ({
  client,
  assetId,
  predictionDefinitionId,
  viewport: passedInViewport,
}: SiteWiseL4EAnomalyOptions) => {
  const viewport = passedInViewport ?? DEFAULT_VIEWPORT;

  const asset = useDescribeAsset({ client, assetId });

  const anomalyModel = useDescribeAssetModelCompositeModel({
    client,
    assetModelId: asset.data?.assetModelId,
    assetModelCompositeModelId: predictionDefinitionId,
  });

  const anomalyEvents = useGetAssetPropertyValueHistory({
    client,
    assetId,
    propertyId: getAnomalyResultProperty(anomalyModel.data)?.id,
    startDate: viewport.start,
    endDate: viewport.end,
    fetchAll: true,
  });

  const parsedAnomalyEvents = parseAnomalyEvents(
    anomalyEvents.assetPropertyValueHistory
  );
  const parsedProperties = extractDiagnoticProperties(parsedAnomalyEvents);

  const describedAssetProperties = useDescribeAssetProperties({
    client,
    describeAssetPropertyRequests: parsedProperties.map((propertyId) => ({
      assetId,
      propertyId,
    })),
  });

  const queries = [
    asset,
    anomalyModel,
    describedAssetProperties,
    anomalyEvents,
  ];

  const isError = queries.some(({ isError }) => isError);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isSuccess = queries.every(({ isSuccess }) => isSuccess);

  return {
    asset: asset.data,
    anomalyModel: anomalyModel.data,
    anomalyEvents: parsedAnomalyEvents,
    properties: describedAssetProperties.data,

    isError,
    isFetching,
    isLoading,
    isSuccess,
  };
};
