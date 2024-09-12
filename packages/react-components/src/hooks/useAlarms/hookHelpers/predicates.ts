import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import {
  AlarmAssetModelRequest,
  AlarmAssetRequest,
  AlarmCompositeModelRequest,
  AlarmInputPropertyRequest,
  AlarmProperty,
  AlarmRequest,
} from '../types';

export const isAssetModelRequest = (
  alarmRequest: AlarmRequest
): alarmRequest is AlarmAssetModelRequest => alarmRequest.assetId === undefined;

export const isAssetRequest = (
  alarmRequest: AlarmRequest
): alarmRequest is
  | AlarmCompositeModelRequest
  | AlarmInputPropertyRequest
  | AlarmAssetRequest => alarmRequest.assetModelId === undefined;

export const isAlarmProperty = (
  property?: AlarmProperty
): property is AlarmProperty => !!property?.property;

export const isAssetPropertyValue = (
  assetPropertyValue?: AssetPropertyValue
): assetPropertyValue is AssetPropertyValue => Boolean(assetPropertyValue);
