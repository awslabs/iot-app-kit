import { isNil } from 'lodash';
import type { PropertyValue } from '@aws-sdk/client-iottwinmaker';
import type { DataStream, DataPoint } from '@iot-app-kit/core';
import { toValue } from '../../utils/propertyValueUtils';

/**
 * Converts a response for data into a data point understood by IoT App Kit.
 */
export const toDataPoint = (
  propertyValue: PropertyValue | undefined
): DataPoint | undefined => {
  if (isNil(propertyValue)) {
    return undefined;
  }
  const { time, value } = propertyValue;
  if (isNil(time) || isNil(value)) {
    return undefined;
  }

  const dataValue = toValue(value);
  if (dataValue === undefined) {
    return undefined;
  }

  return {
    x: new Date(time).getTime(),
    y: dataValue,
  };
};

export const toDataStream = ({
  streamId,
  dataPoints = [],
  entityId,
  componentName,
  propertyName,
  nextToken,
  fetchMostRecent,
}: {
  streamId: string;
  dataPoints: DataPoint[];
  entityId: string;
  componentName: string;
  propertyName: string;
  nextToken: string | undefined;
  fetchMostRecent: boolean;
}): DataStream => {
  const dataStream: DataStream = {
    id: streamId,
    data: dataPoints,
    resolution: 0,
    meta: {
      entityId,
      componentName,
      propertyName,
    },
    isRefreshing: !!nextToken && !fetchMostRecent,
  };

  return dataStream;
};
