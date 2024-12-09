import { type IoTSiteWiseClient, Quality } from '@aws-sdk/client-iotsitewise';
import {
  type DataPoint,
  type DataStream,
  type HistoricalViewport,
  toSiteWiseAssetProperty,
} from '@iot-app-kit/core';
import { type StyledSiteWiseQueryConfig } from '../../customization/widgets/types';
import { type AssetSummary } from '../../hooks/useAssetDescriptionQueries';
import { getDescribedTimeSeries } from './getDescribedTimeSeries';
import { type CSVDownloadObject } from './types';

// Check if time is within passed in viewport OR within last x amount of time from request
const isTimeWithinViewport = (
  dataPointTimestamp: number,
  viewport: HistoricalViewport
) => {
  const currentPoint = new Date(dataPointTimestamp);
  return currentPoint >= viewport.start && currentPoint <= viewport.end;
};

export const convertToCSVObject = async ({
  dataStreams,
  queryConfig,
  client,
  viewport,
  listAssetPropertiesMap,
}: {
  dataStreams: DataStream[];
  queryConfig: StyledSiteWiseQueryConfig;
  client?: IoTSiteWiseClient;
  viewport: HistoricalViewport;
  listAssetPropertiesMap: Record<string, AssetSummary>;
}): Promise<{
  data: CSVDownloadObject[];
  hasError: boolean;
}> => {
  if (!client) return { data: [], hasError: false };

  // flatten all the data in a single dataStream into one array of CSVDownloadObject
  const flattenDataPoints = async (dataStream: DataStream) => {
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
    const { data: unmodeledDescribedTimeSeries, hasError } = isUnmodeledData
      ? await getDescribedTimeSeries({
          client,
          alias: id,
        })
      : { data: undefined, hasError: false };

    if (hasError || dataStreamError) {
      return { flatPoints: [], hasError: true };
    }

    const flatPoints = data.reduce(
      (flattenedData: CSVDownloadObject[], currentDataPoint: DataPoint) => {
        const { x: xValue, y: yValue } = currentDataPoint;

        const isPointWithinViewport = isTimeWithinViewport(xValue, viewport);

        if (isPointWithinViewport) {
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
            const { assetId, propertyId } = toSiteWiseAssetProperty(
              dataStream.id
            );
            const describedModelProperty = listAssetPropertiesMap[
              assetId
            ]?.properties.find(
              ({ propertyId: propId }) => propId === propertyId
            );
            const modeledDataPoint: CSVDownloadObject = {
              ...commonData,
              assetName: listAssetPropertiesMap[assetId]?.assetName,
              propertyName: describedModelProperty?.name,
              propertyAlias: describedModelProperty?.alias,
              dataType: describedModelProperty?.dataType,
              dataTypeSpec: undefined,
              assetId,
              unit: describedModelProperty?.unit,
              propertyId,
            };

            flattenedData.push(modeledDataPoint);
          }
        }
        return flattenedData;
      },
      [] as CSVDownloadObject[]
    );

    return { flatPoints, hasError: false };
  };

  const promises = dataStreams.map((dataStream: DataStream) =>
    flattenDataPoints(dataStream)
  );
  const flatData = await Promise.all(promises);

  const hasError = flatData.some((point) => point.hasError);
  if (hasError) {
    return { data: [], hasError: true };
  }

  return { data: flatData.flatMap((d) => d.flatPoints), hasError: false };
};
