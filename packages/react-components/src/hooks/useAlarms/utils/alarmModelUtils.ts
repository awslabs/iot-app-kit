import { DescribeAlarmModelResponse } from '@aws-sdk/client-iot-events';
import { SITE_WISE_BACKED_PROPERTY_PREFIX } from '../constants';
import { AlarmData, AlarmProperty } from '../types';

/**
 * Expecting the alarm model name to be at the end of the ARN after the last '/'
 *
 * @param alarmModelArn is the alarm model ARN of the format:
 *    arn:<partition>:iotevents:<region>:<accountId>:alarmModel/<alarmModelName>
 * @returns the alarm model name or undefined if the ARN is malformed
 */
const nameFromAlarmModelArn = (alarmModelArn: string): string | undefined => {
  const arnSplit = alarmModelArn.split('/');
  if (arnSplit.length === 2 && arnSplit[1] !== '') {
    return arnSplit[1];
  }
};

/**
 * Function extracts an IoT Events alarm model name from an IoT SiteWise alarm source property.
 * An alarm source property stores an associated IoT Events alarm model ARN as a property value.
 * This is only supported for "IOT_EVENTS" alarm types.
 *
 * @param alarmSourceProperty is an AlarmProperty as defined on an AlarmData object
 * @returns the IoT Events alarm model name if available
 */
export const getAlarmModelNameFromAlarmSourceProperty = (
  alarmSourceProperty?: AlarmProperty
): string | undefined => {
  let alarmModelArn: string | undefined;
  if (alarmSourceProperty?.data && alarmSourceProperty?.data.length > 0) {
    const dataLength = alarmSourceProperty?.data.length;
    // Get latest property value
    alarmModelArn = alarmSourceProperty.data[dataLength - 1].value?.stringValue;
  }
  return alarmModelArn && nameFromAlarmModelArn(alarmModelArn);
};

const isBackedBySiteWiseAssetProperty = (inputProperty: string): boolean =>
  inputProperty.startsWith(SITE_WISE_BACKED_PROPERTY_PREFIX);

const removeBackticks = (value: string) => {
  return value.replace(/^`|`$/g, '');
};

/**
 * Expecting the propertyId to be the 3rd string after $sitewise prefix.
 *
 * @param inputProperty - an expression with the propertyId e.g.
 *    $sitewise.assetModel.`f6dca270-d4b9-4de0-9722-d57d3f260cb8`.`00b36ed5-7640-4635-b9d3-60c2db229568`.propertyValue.value
 *    here the propertyId is 00b36ed5-7640-4635-b9d3-60c2db229568
 * @returns the propertyId or undefined if we are not provided with a model propertyId that is backed by SiteWise
 */
const extractAssetPropertyId = (
  inputProperty: string | undefined
): string | undefined => {
  if (inputProperty && isBackedBySiteWiseAssetProperty(inputProperty)) {
    const splitInputProperty = inputProperty.split('.');
    return removeBackticks(splitInputProperty[3]);
  }
};

/**
 * Function filters out AlarmData where the inputProperty field does not match
 * any of its IoT Events alarm models.
 *
 * useAlarms fills in the inputProperty field if the original AlarmRequest has
 * an inputPropertyId specified. Need to fetch all alarms from an asset and
 * check them against all IoT Events alarm models to find which alarms have
 * the inputPropertyId.
 *
 * @param alarmDataList is the list of AlarmData with fetched assets and alarm models
 * @returns a filtered list of AlarmData where inputPropertyId matches the inputProperty
 * from the alarm model
 */
export const filterAlarmsMatchingInputProperties = (
  alarmDataList: AlarmData[]
) => {
  return alarmDataList.filter((alarmData) => {
    if (alarmData.inputProperty) {
      let matchingAlarmModel: DescribeAlarmModelResponse | undefined;
      for (const property of alarmData.inputProperty) {
        matchingAlarmModel = alarmData.models?.find((alarmModel) => {
          const inputPropertyId = extractAssetPropertyId(
            alarmModel.alarmRule?.simpleRule?.inputProperty
          );
          return inputPropertyId === property.id;
        });
      }
      return matchingAlarmModel ? true : false;
    } else {
      return true;
    }
  });
};
