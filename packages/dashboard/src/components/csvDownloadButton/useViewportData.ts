import {
  Viewport,
  parseDuration,
  DataStream,
  DataPoint,
} from '@iot-app-kit/core';
import { useTimeSeriesData, useViewport } from '@iot-app-kit/react-components';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { useListAssetPropertiesMapQuery } from '~/hooks/useAssetDescriptionQueries';
import { useQueries } from '~/components/dashboard/queryContext';
import { CSVDownloadObject } from './types';
import { IoTSiteWiseClient, Quality } from '@aws-sdk/client-iotsitewise';
import { getDescribedTimeSeries } from './getDescribedTimeSeries';

const DEFAULT_VIEWPORT = { duration: '10m' };

// Check if time is within passed in viewport OR within last x amount of time from request
const isTimeWithinViewport = (
  dataPointTimestamp: number,
  viewport: Viewport,
  timeOfRequestMS: number
) => {
  const currentPoint = new Date(dataPointTimestamp);
  if ('duration' in viewport) {
    // absolute time range
    const duration = parseDuration(viewport.duration);
    return (
      currentPoint >= new Date(timeOfRequestMS - duration) &&
      currentPoint <= new Date(timeOfRequestMS)
    );
  } else {
    // relative time range
    return currentPoint >= viewport.start && currentPoint <= viewport.end;
  }
};

export const useViewportData = ({
  queryConfig,
  viewport: passedInViewport,
  client,
}: {
  queryConfig: StyledSiteWiseQueryConfig;
  client: IoTSiteWiseClient;
  viewport?: Viewport;
}) => {
  const queries = useQueries(queryConfig.query);
  const { dataStreams } = useTimeSeriesData({ queries });

  const describedAssetsMapQuery = useListAssetPropertiesMapQuery(
    queryConfig.query
  );
  const describedAssetsMap = describedAssetsMapQuery.data ?? {};

  const { viewport: injectedViewport } = useViewport();
  const viewport = passedInViewport || injectedViewport || DEFAULT_VIEWPORT;

  // flatten all the data in a single dataStream into one array of CSVDownloadObject
  const flattenDataPoints = async (
    dataStream: DataStream,
    timeOfRequestMS: number
  ) => {
    const {
      id,
      unit,
      resolution,
      aggregationType,
      data,
      error: dataStreamError,
    } = dataStream;
    const isUnmodeledData = queryConfig.query?.properties?.some(
      (pr) => pr.propertyAlias === id
    );
    const { data: unmodeledDescribedTimeSeries, isError } = isUnmodeledData
      ? await getDescribedTimeSeries({
          client,
          alias: id,
        })
      : { data: undefined, isError: false };

    if (isError || dataStreamError) {
      return { flatPoints: [], isError };
    }

    const flatPoints = data.reduce(
      (flattenedData: CSVDownloadObject[], currentDataPoint: DataPoint) => {
        const { x: xValue, y: yValue } = currentDataPoint;
        const pointWithinViewport = isTimeWithinViewport(
          xValue,
          viewport,
          timeOfRequestMS
        );

        // do not include data point if it falls outside viewport range
        if (pointWithinViewport) {
          const commonData = {
            value: yValue,
            unit,
            timestamp: new Date(xValue).toISOString(),
            aggregationType: aggregationType,
            resolution,
            dataQuality: Quality.GOOD,
          };

          if (isUnmodeledData) {
            const unmodeledDataPoint: CSVDownloadObject = {
              ...commonData,
              propertyAlias: unmodeledDescribedTimeSeries?.alias,
              dataType: unmodeledDescribedTimeSeries?.dataType,
              dataTypeSpec: unmodeledDescribedTimeSeries?.dataTypeSpec,
              assetId: unmodeledDescribedTimeSeries?.assetId,
              propertyId: undefined,
            };

            flattenedData.push(unmodeledDataPoint);
          } else {
            const assetPropId = dataStream.id.split('---');
            const describedModelProperty = describedAssetsMap[
              assetPropId[0]
            ]?.properties.find(
              ({ propertyId }) => propertyId === assetPropId[1]
            );

            const modeledDataPoint: CSVDownloadObject = {
              ...commonData,
              assetName: describedAssetsMap[assetPropId[0]]?.assetName,
              propertyName: describedModelProperty?.name,
              propertyAlias: describedModelProperty?.alias,
              dataType: describedModelProperty?.dataType,
              dataTypeSpec: undefined,
              assetId: assetPropId[0],
              propertyId: assetPropId[1],
            };

            flattenedData.push(modeledDataPoint);
          }
        }
        return flattenedData;
      },
      [] as CSVDownloadObject[]
    );

    return { flatPoints, isError: false };
  };

  const fetchViewportData = async (timeOfRequestMS: number) => {
    const promises = dataStreams.map((dataStream: DataStream) =>
      flattenDataPoints(dataStream, timeOfRequestMS)
    );
    const flatData = await Promise.all(promises);

    const isError = flatData.some((point) => point.isError);
    if (isError) {
      return { data: undefined, isError: true };
    }

    return { data: flatData.map((d) => d.flatPoints).flat(1), isError: false };
  };

  return {
    fetchViewportData,
  };
};
