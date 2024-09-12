import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import {
  RequestFunction,
  RequestParameters,
  RequestResponse,
} from '@iot-app-kit/core';

export const isAlarmModelId = (alarmModelId?: string): alarmModelId is string =>
  Boolean(alarmModelId);

export const isAssetId = (assetId?: string): assetId is string =>
  Boolean(assetId);

export const isAssetModelId = (assetModelId?: string): assetModelId is string =>
  Boolean(assetModelId);

export const isAssetModelCompositeModelId = (
  assetModelCompositeModelId?: string
): assetModelCompositeModelId is string => Boolean(assetModelCompositeModelId);

export const isPropertyId = (propertyId?: string): propertyId is string =>
  Boolean(propertyId);

export const isPropertyAlias = (
  propertyAlias?: string
): propertyAlias is string => Boolean(propertyAlias);

export const isStartDate = (startDate?: number): startDate is number =>
  Boolean(startDate);

export const isEndDate = (endDate?: number): endDate is number =>
  Boolean(endDate);

export const hasClient = (
  client?: IoTSiteWiseClient
): client is IoTSiteWiseClient => Boolean(client);

export const hasRequestFunction = <Requester>(
  requestFunction?: RequestFunction<
    RequestParameters<Requester>,
    RequestResponse<Requester>
  >
): requestFunction is RequestFunction<
  RequestParameters<Requester>,
  RequestResponse<Requester>
> => Boolean(requestFunction);
