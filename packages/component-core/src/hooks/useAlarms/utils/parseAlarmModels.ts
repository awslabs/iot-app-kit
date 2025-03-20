import { type DescribeAlarmModelResponse } from '@aws-sdk/client-iot-events';
import { SITE_WISE_BACKED_PROPERTY_PREFIX } from '../constants';
import type { AlarmProperty } from '../types';
import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';

/**
 * Extracts the alarm model name from its ARN.
 * Expecting the alarm model name to be at the end of the ARN after the last '/'.
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
 * Extracts an IoT Events alarm model name from an IoT SiteWise alarm source property.
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

const isBackedBySiteWiseAssetProperty = (propertyExpression: string): boolean =>
  propertyExpression.startsWith(SITE_WISE_BACKED_PROPERTY_PREFIX);

const removeBackticks = (value: string) => {
  return value.replace(/^`|`$/g, '');
};

/**
 * Extracts the propertyId from an alarm model expression.
 * Expect to find the property as the 3rd string after $sitewise prefix.
 *
 * @param propertyExpression - an expression with the propertyId e.g.
 *    $sitewise.assetModel.`f6dca270-d4b9-4de0-9722-d57d3f260cb8`.`00b36ed5-7640-4635-b9d3-60c2db229568`.propertyValue.value
 *    here the propertyId is 00b36ed5-7640-4635-b9d3-60c2db229568
 * @returns the propertyId or undefined if we are not provided with a model propertyId that is backed by SiteWise
 */
export const extractAssetPropertyId = (
  propertyExpression?: string
): string | undefined => {
  if (
    propertyExpression &&
    isBackedBySiteWiseAssetProperty(propertyExpression)
  ) {
    const splitInputProperty = propertyExpression.split('.');
    return removeBackticks(splitInputProperty[3]);
  }
};

/**
 * Extracts a threshold value that is defined on an IoT Events alarm model.
 * The value is converted to a SiteWise asset property value for consistency
 * with processing threshold values modeled by a SiteWise asset property.
 *
 * @param alarmModel is the IoT Events alarm model
 * @returns an AssetPropertyValue with the static value if defined
 */
export const getStaticThresholdAsAssetPropertyValue = (
  alarmModel?: DescribeAlarmModelResponse
): AssetPropertyValue | undefined => {
  if (alarmModel) {
    const threshold = alarmModel.alarmRule?.simpleRule?.threshold;
    if (threshold && !isBackedBySiteWiseAssetProperty(threshold)) {
      // Define the timestamp on the value based on the alarm model lastUpdateTime
      const timestamp = alarmModel.lastUpdateTime
        ? {
            timeInSeconds: Math.round(
              alarmModel.lastUpdateTime.getTime() / 1000
            ),
          }
        : undefined;
      /**
       * The threshold value field is a string on the alarm model
       * but we model it as a double in SiteWise
       */
      return {
        value: {
          doubleValue: parseFloat(threshold),
        },
        timestamp,
      };
    }
  }
};
