import { Viewport, parseDuration, DataStream, DataPoint } from '@iot-app-kit/core';
import { useTimeSeriesData, useViewport } from '@iot-app-kit/react-components';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { useAssetDescriptionMapQuery } from '~/hooks/useAssetDescriptionQueries';
import { useQueries } from '~/components/dashboard/queryContext';
import { CSVDownloadObject } from './types';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useDescribeUnmodeledTimeSeries } from './useDescribeUnmodeledTimeSeries';

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
  const { unmodeledAssetDescription, isSuccess } = useDescribeUnmodeledTimeSeries(queryConfig, client);

  const describedAssetsMapQuery = useAssetDescriptionMapQuery(queryConfig.query);
  const describedAssetsMap = describedAssetsMapQuery.data ?? {};

  const { viewport: injectedViewport } = useViewport();
  const viewport = passedInViewport || injectedViewport || DEFAULT_VIEWPORT;

  // flatten all the data in a single dataStream into one array of CSVDownloadObject
  const flattenDataPoints = (dataStream: DataStream, timeOfRequestMS: number) => {
    const { id, unit, resolution, aggregationType, data } = dataStream;

    return data.reduce((flattenedData: CSVDownloadObject[], currentDataPoint: DataPoint) => {
      const { x: xValue, y: yValue } = currentDataPoint;
      const pointWithinViewport = isTimeWithinViewport(xValue, viewport, timeOfRequestMS);

      // do not include data point if it falls outside viewport range
      if (pointWithinViewport) {
        const isUnmodeledData = queryConfig.query?.properties?.some((pr) => pr.propertyAlias === dataStream.id);
        const assetPropId = !isUnmodeledData ? dataStream.id.split('---') : []; // modeled datastream IDs follow the pattern {assetID}---{propertyID}
        const describedModelProperty = describedAssetsMap[assetPropId[0]]?.properties.find(
          ({ propertyId }) => propertyId === assetPropId[1]
        );
        const unmodeledDataStreamDescription = unmodeledAssetDescription.find(({ alias }) => alias === id);

        const flatDataPoint: CSVDownloadObject = {
          assetName: describedAssetsMap[assetPropId[0]]?.assetName,
          propertyName: describedModelProperty?.name,
          propertyAlias: isUnmodeledData ? unmodeledDataStreamDescription?.alias : describedModelProperty?.alias,
          value: yValue,
          unit,
          timestamp: new Date(xValue).toISOString(),
          aggregationType: aggregationType,
          resolution,
          dataType: isUnmodeledData ? unmodeledDataStreamDescription?.dataType : describedModelProperty?.dataType,
          dataTypeSpec: isUnmodeledData ? unmodeledDataStreamDescription?.dataTypeSpec : undefined,
          dataQuality: 'GOOD',
          assetId: isUnmodeledData ? unmodeledDataStreamDescription?.assetId : assetPropId[0],
          propertyId: isUnmodeledData ? undefined : assetPropId[1],
        };

        flattenedData.push(flatDataPoint);
      }
      return flattenedData;
    }, [] as CSVDownloadObject[]);
  };

  const fetchViewportData = (timeOfRequestMS: number) => {
    return dataStreams.reduce((flattenedStreams: CSVDownloadObject[], currentDataStream: DataStream) => {
      flattenedStreams.push(...flattenDataPoints(currentDataStream, timeOfRequestMS));
      return flattenedStreams;
    }, [] as CSVDownloadObject[]);
  };

  return {
    fetchViewportData,
    canDownloadData: !isSuccess || dataStreams.length === 0,
  };
};
