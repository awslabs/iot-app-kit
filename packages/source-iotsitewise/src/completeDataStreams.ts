import { DescribeAssetModelResponse, PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { DataStream, DataType } from '@iot-app-kit/core';
import { DataPoint } from '@synchro-charts/core';
import { toSiteWiseAssetProperty, toId } from './time-series-data/util/dataStreamId';
import { SiteWiseDataStreamQuery, PropertyQuery, AlarmSource } from './time-series-data/types';
import {
  parseAlarmData as parseIoTEventsAlarmData,
  SOURCE as IoTEventsSource,
} from './time-series-data/alarms/iotevents';

const toDataType = (propertyDataType: PropertyDataType | string | undefined): DataType => {
  if (propertyDataType === 'STRING') {
    return 'STRING';
  }
  if (propertyDataType === 'BOOLEAN') {
    return 'BOOLEAN';
  }

  return 'NUMBER';
};

const parseAlarmData = ({ alarmSource, data }: { alarmSource: AlarmSource; data: DataPoint[] }): DataPoint[] => {
  if (alarmSource === IoTEventsSource) {
    return data.map(({ x, y }: DataPoint): DataPoint => {
      if (typeof y === 'string') {
        return { x, y: parseIoTEventsAlarmData(y) };
      }
      return { x, y };
    });
  }

  return data;
};

/**
 * Get completed data streams by merging together the data streams with the asset models.
 */
export const completeDataStreams = ({
  dataStreams,
  assetModels,
  queries,
}: {
  dataStreams: DataStream[];
  assetModels: Record<string, DescribeAssetModelResponse>;
  queries: SiteWiseDataStreamQuery[];
}): DataStream[] => {
  const normalizedQueries: { [key: string]: Partial<PropertyQuery> } = {};

  queries.forEach(({ assets }) =>
    assets.forEach(({ assetId, properties }) =>
      properties.forEach(({ propertyId, ...settings }) => {
        const streamId = toId({ assetId, propertyId });
        normalizedQueries[streamId] = settings;
      })
    )
  );

  return dataStreams.map((dataStream) => {
    const correspondingQuery = normalizedQueries[dataStream.id];

    if (correspondingQuery) {
      dataStream.streamType = correspondingQuery.streamType;
      dataStream.associatedStreams = correspondingQuery.associatedStreams;

      if (correspondingQuery.alarmSource) {
        dataStream.data = parseAlarmData({ alarmSource: correspondingQuery.alarmSource, data: dataStream.data });
      }
    }

    const { assetId, propertyId } = toSiteWiseAssetProperty(dataStream.id);
    const assetModel = assetModels[assetId];

    if (assetModel == null || assetModel.assetModelProperties == null) {
      return dataStream;
    }

    const property = assetModel.assetModelProperties.find(({ id }) => id === propertyId);

    if (property == null) {
      return dataStream;
    }

    return {
      ...dataStream,
      name: property.name,
      unit: property.unit,
      dataType: toDataType(property.dataType),
    };
  });
};
