import { Viewport, parseDuration, DataStream, DataPoint } from '@iot-app-kit/core';
import { useTimeSeriesData, useViewport } from '@iot-app-kit/react-components';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { useAssetDescriptionMapQuery } from '~/hooks/useAssetDescriptionQueries';
import { useQueries } from '~/components/dashboard/queryContext';
import { CSVDownloadObject } from './types';
import { IoTSiteWiseClient, Quality } from '@aws-sdk/client-iotsitewise';
import { getDescribedTimeSeries } from './getDescribedTimeSeries';

const DEFAULT_VIEWPORT = { duration: '10m' };

// Format Date to be a string in format: "YYYY/MM/DD HH:MM:SS"
export const formatDate = (date: Date) => {
  const dateString = date.getFullYear().toString() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  const timeString = date.toTimeString().split(' ')[0];
  const dateTime = dateString + ' ' + timeString;
  return dateTime;
};

// Check if time is within passed in viewport OR within last x amount of time from request
const isTimeWithinViewport = (dataPointTimestamp: number, viewport: Viewport, timeOfRequestMS: number) => {
  const currentPoint = new Date(dataPointTimestamp);
  if ('duration' in viewport) {
    // absolute time range
    const duration = parseDuration(viewport.duration);
    return currentPoint >= new Date(timeOfRequestMS - duration) && currentPoint <= new Date(timeOfRequestMS);
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

  const describedAssetsMapQuery = useAssetDescriptionMapQuery(queryConfig.query);
  const describedAssetsMap = describedAssetsMapQuery.data ?? {};

  const { viewport: injectedViewport } = useViewport();
  const viewport = passedInViewport || injectedViewport || DEFAULT_VIEWPORT;

  // flatten all the data in a single dataStream into one array of CSVDownloadObject
  const flattenDataPoints = async (dataStream: DataStream, timeOfRequestMS: number) => {
    const { id, unit, resolution, aggregationType, data } = dataStream;
    const isUnmodeledData = queryConfig.query?.properties?.some((pr) => pr.propertyAlias === id);
    const { data: unmodeledDescribedTimeSeries } = isUnmodeledData
      ? await getDescribedTimeSeries({
          client,
          alias: id,
        })
      : { data: undefined };

    return data.reduce((flattenedData: CSVDownloadObject[], currentDataPoint: DataPoint) => {
      const { x: xValue, y: yValue } = currentDataPoint;
      const pointWithinViewport = isTimeWithinViewport(xValue, viewport, timeOfRequestMS);

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
          const describedModelProperty = describedAssetsMap[assetPropId[0]]?.properties.find(
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
    }, [] as CSVDownloadObject[]);
  };

  const fetchViewportData = async (timeOfRequestMS: number) => {
    const promises = dataStreams.map((dataStream: DataStream) => flattenDataPoints(dataStream, timeOfRequestMS));
    const flatData = await Promise.all(promises);
    return flatData.flat(1);
  };

  return {
    fetchViewportData,
    canDownloadData: dataStreams.length === 0,
  };
};
