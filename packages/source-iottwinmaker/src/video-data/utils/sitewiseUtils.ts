import {
  BatchPutAssetPropertyErrorEntry,
  BatchPutAssetPropertyValueCommand,
  GetAssetPropertyValueCommand,
  GetAssetPropertyValueRequest,
  GetInterpolatedAssetPropertyValuesCommand,
  GetInterpolatedAssetPropertyValuesRequest,
  InterpolatedAssetPropertyValue,
  IoTSiteWiseClient,
  PutAssetPropertyValueEntry,
} from '@aws-sdk/client-iotsitewise';
import { Primitive } from '../../common/types';
import { LIVE_STREAM_VALUE, GOOD_QUALITY_VALUE, LOCF_INTERPOLATION, LIVE_VIDEO } from '../constants';
import { GetLastValueBeforeTimestampRequest, TriggerVideoUploadRequest } from '../types';

export const triggerVideoUploadRequest = async (
  triggerVideoUploadRequest: TriggerVideoUploadRequest,
  sitewiseClient: IoTSiteWiseClient
): Promise<BatchPutAssetPropertyErrorEntry[] | undefined> => {
  let propertyValue = '';
  if (triggerVideoUploadRequest.startTimestamp && triggerVideoUploadRequest.endTimestamp) {
    propertyValue = `${triggerVideoUploadRequest.startTimestamp}-${triggerVideoUploadRequest.endTimestamp}`;
  } else {
    propertyValue = LIVE_STREAM_VALUE;
  }

  const now = new Date();
  const entry: PutAssetPropertyValueEntry = {
    entryId: LIVE_VIDEO,
    assetId: triggerVideoUploadRequest.assetId,
    propertyId: triggerVideoUploadRequest.propertyId,
    propertyValues: [
      {
        timestamp: {
          offsetInNanos: (now.getTime() % 1000) * 1000000,
          timeInSeconds: now.getTime() / 1000,
        },
        value: {
          stringValue: propertyValue,
        },
        quality: GOOD_QUALITY_VALUE,
      },
    ],
  };

  const response = await sitewiseClient.send(new BatchPutAssetPropertyValueCommand({ entries: [entry] }));
  return Promise.resolve(response.errorEntries);
};

export const getAssetPropertyValue = async (
  getAssetPropertyValueRequest: GetAssetPropertyValueRequest,
  sitewiseClient: IoTSiteWiseClient
): Promise<Primitive | undefined> => {
  const req = Object.assign({}, getAssetPropertyValueRequest);

  const response = await sitewiseClient.send(new GetAssetPropertyValueCommand(req));
  let propertyValue: Primitive | undefined = undefined;
  if (response.propertyValue) {
    const dataValue = response.propertyValue.value;
    if (dataValue) {
      if (dataValue.stringValue !== undefined) {
        propertyValue = dataValue.stringValue;
      } else if (dataValue.doubleValue !== undefined) {
        propertyValue = dataValue.doubleValue;
      } else if (dataValue.integerValue !== undefined) {
        propertyValue = dataValue.integerValue;
      } else if (dataValue.booleanValue !== undefined) {
        propertyValue = dataValue.booleanValue;
      }
    }
  }

  return propertyValue;
};

export const getLastValueBeforeTimestamp = async (
  getLastValueBeforeTimestampRequest: GetLastValueBeforeTimestampRequest,
  sitewiseClient: IoTSiteWiseClient
): Promise<Date> => {
  const timeInSeconds = Math.floor(getLastValueBeforeTimestampRequest.timestamp.getTime() / 1000);
  const request: GetInterpolatedAssetPropertyValuesRequest = {
    assetId: getLastValueBeforeTimestampRequest.assetId,
    propertyId: getLastValueBeforeTimestampRequest.propertyId,
    startTimeInSeconds: timeInSeconds - 1,
    endTimeInSeconds: timeInSeconds,
    quality: GOOD_QUALITY_VALUE,
    intervalInSeconds: 1,
    type: LOCF_INTERPOLATION,
  };

  let interpolatedEndTime = new Date('None');

  let result: InterpolatedAssetPropertyValue[] = [];
  const req = Object.assign({}, request);

  do {
    const response = await sitewiseClient.send(new GetInterpolatedAssetPropertyValuesCommand(req));
    if (response.interpolatedAssetPropertyValues) {
      result = result.concat(response.interpolatedAssetPropertyValues);
    }

    req.nextToken = response.nextToken;
  } while (req.nextToken);

  if (result.length > 0 && result[0].value?.doubleValue !== undefined && result[0].value?.doubleValue > timeInSeconds) {
    interpolatedEndTime = new Date(result[0].value.doubleValue * 1000);
  }
  return interpolatedEndTime;
};
