import {
  AlarmAssetModelRequest,
  AlarmAssetRequest,
  AlarmCompositeModelRequest,
  AlarmInputPropertyRequest,
  AlarmRequest,
} from '../types';

export const isAssetModelRequest = (
  alarmRequest: AlarmRequest
): alarmRequest is AlarmAssetModelRequest => Boolean(alarmRequest);

export const isAssetRequest = (
  alarmRequest: AlarmRequest
): alarmRequest is
  | AlarmCompositeModelRequest
  | AlarmInputPropertyRequest
  | AlarmAssetRequest => Boolean(alarmRequest);
