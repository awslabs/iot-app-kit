// import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { Viewport } from '@iot-app-kit/core';
import { useDescribeAssetModelCompositeModel } from '../useDescribeAssetModelCompositeModel';
// import { useGetAssetPropertyValueHistory } from '../useGetAssetPropertyValueHistory';
import { useDescribeAsset } from '../useDescribeAsset';
import { useDescribeAssetProperties } from '../useDescribeAssetProperties';
import { getAnomalyResultProperty } from './getAnomalyResultProperty';
import { parseAnomalyEvents } from './parseAnomaly/parseAnomalyEvents';
import { extractDiagnoticProperties } from './parseAnomaly/extractDiagnoticProperties';
import { completeAnomalyEvents } from './parseAnomaly/completeAnomalyEvents';
import { AnomalyObjectDataSource } from '../../data';
import { DataSource } from '../../data/types';
// import { useAnomalyEventsViewport } from './useAnomalyEventsViewport';
import { useViewport } from '../../hooks/useViewport';
import { useAssetPropertyValueHistory } from '../useAssetPropertyValueHistory/useAssetPropertyValueHistory';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';

const parseQueryState = ({
  isError,
  isFetching,
  isLoading,
  isSuccess,
}: {
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}): DataSource['state'] => {
  if (isFetching || isLoading) return 'loading';
  else if (isError) return 'error';
  else if (isSuccess) return 'success';
  return 'failed';
};

export type SiteWiseAnomalyDataSourceOptions = {
  client?: IoTSiteWise;
  assetId?: string;
  assetModelId?: string;
  predictionDefinitionId?: string;
  viewport?: Viewport;
  liveModeQueryRefreshRate?: number;
  styles?: AnomalyObjectDataSource['value']['styles'];
};

/**
 * Query to get parsed Anomaly Results from SiteWise
 * These events are mapped into an Anomaly datasource
 * to be used within appkit charts / widgets
 *
 * Events are fetched by asset or assetModel.
 * The anomnaly model is determined by using the assetId
 * to get the assetModelId or by using the assetModelId directly,
 * and the predictionDefinitionId as the assetModelCompositeModelId.
 *
 * The AssetPropertyValue complex types are parsed into plain
 * javascript objects
 */
export const useSiteWiseAnomalyDataSource = (
  options: SiteWiseAnomalyDataSourceOptions = {}
): AnomalyObjectDataSource => {
  const {
    client,
    assetId,
    assetModelId,
    predictionDefinitionId,
    viewport: passedInViewport,
    // liveModeQueryRefreshRate,
    styles,
  } = options;

  const { viewport: injectedViewport } = useViewport();

  // const { start, end } = useAnomalyEventsViewport({
  //   viewport: passedInViewport ?? injectedViewport,
  //   liveModeRefreshRate: liveModeQueryRefreshRate,
  // });

  const asset = useDescribeAsset({ client, assetId });

  const anomalyModel = useDescribeAssetModelCompositeModel({
    client,
    assetModelId: assetModelId ?? asset.data?.assetModelId,
    assetModelCompositeModelId: predictionDefinitionId,
  });

  // const anomalyEvents = useGetAssetPropertyValueHistory({
  //   client,
  //   assetId,
  //   propertyId: getAnomalyResultProperty(anomalyModel.data)?.id,
  //   startDate: start,
  //   endDate: end,
  //   fetchAll: true,
  // });

  const test = useAssetPropertyValueHistory({
    queries: [
      {
        assetId: assetId,
        propertyId: getAnomalyResultProperty(anomalyModel.data)?.id,
        viewport: passedInViewport ?? injectedViewport,
      },
    ],
    getAssetPropertyValueHistory:
      client?.getAssetPropertyValueHistory.bind(client),
  });

  const parsedAnomalyEvents = parseAnomalyEvents(
    test.flatMap((t) => t.data ?? [])
  );
  const parsedProperties = extractDiagnoticProperties(parsedAnomalyEvents);

  const describedAssetProperties = useDescribeAssetProperties({
    client,
    describeAssetPropertyRequests: parsedProperties.map((propertyId) => ({
      assetId,
      propertyId,
    })),
  });

  /**
   * We don't want to complete the events if the names are not
   * available yet, otherwise there will be a flicker of
   * the guid -> name.
   */
  const completedAnomalyEvents = describedAssetProperties.isLoading
    ? []
    : completeAnomalyEvents(parsedAnomalyEvents, describedAssetProperties.data);

  const queries = [
    asset,
    anomalyModel,
    describedAssetProperties,
    ...test,
  ] as const;

  const isError = queries.some(({ isError }) => isError);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isSuccess = queries.every(({ isSuccess }) => isSuccess);

  return {
    state: parseQueryState({ isError, isFetching, isLoading, isSuccess }),
    value: {
      styles,
      data: completedAnomalyEvents,
    },
  };
};
