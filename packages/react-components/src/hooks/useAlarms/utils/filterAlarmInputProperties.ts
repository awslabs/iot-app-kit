import type { AlarmDataInternal } from '../types';
import { extractAssetPropertyId } from './parseAlarmModels';
import { AssetModelProperty, AssetProperty } from '@aws-sdk/client-iotsitewise';

/**
 * Finds the input properties for an alarm based on the original alarm request.
 *
 * Case 1: request has an inputPropertyId
 * Filter out any alarms that don't have an alarm model input property
 * that matches the inputPropertyId.
 *
 * Case 2: request does not have an inputPropertyId
 * Find the input property on the alarm model and assign the inputProperty field
 * with the associated property object.
 *
 * AlarmDataInternal stores the AlarmRequest and asset/assetModel properties
 * which enables resolving the inputProperty.
 *
 * @param alarmDataList is the list of AlarmData with fetched assets and alarm models
 * @returns a filtered list of AlarmData where inputPropertyId matches the inputProperty
 * from the alarm model
 */
export const filterAlarmInputProperties = (
  alarmDataList: AlarmDataInternal[]
) => {
  const filterForInputPropertyRequests = alarmDataList.filter((alarmData) => {
    if (alarmData.request?.inputPropertyId) {
      const matchingAlarmModel = alarmData.models?.find((alarmModel) => {
        const inputPropertyId = extractAssetPropertyId(
          alarmModel.alarmRule?.simpleRule?.inputProperty
        );
        return inputPropertyId === alarmData.request?.inputPropertyId;
      });
      return Boolean(matchingAlarmModel);
    }
    return true;
  });

  return filterForInputPropertyRequests.map((alarmData) => {
    let inputProperty: AssetProperty | AssetModelProperty | undefined;
    if (alarmData.models) {
      const inputPropertyId = extractAssetPropertyId(
        alarmData.models[0].alarmRule?.simpleRule?.inputProperty
      );
      inputProperty = alarmData.properties?.find(
        (property) => property.id === inputPropertyId
      );
    }
    return {
      ...alarmData,
      inputProperty: inputProperty ? [inputProperty] : undefined,
    };
  });
};
