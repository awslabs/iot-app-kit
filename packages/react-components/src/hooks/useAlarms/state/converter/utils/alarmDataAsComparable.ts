import { AlarmData } from '../../../types';

export const alarmDataAsComparable = (alarmData: AlarmData) =>
  `${alarmData.assetId}---${alarmData.assetModelId}---${alarmData.compositeModelId}`;
