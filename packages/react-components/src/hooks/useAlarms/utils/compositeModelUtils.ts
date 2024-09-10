import {
  AssetCompositeModel,
  AssetModelCompositeModel,
  AssetModelProperty,
  AssetProperty,
  AssetPropertyValue,
} from '@aws-sdk/client-iotsitewise';
import {
  ALARM_COMPOSITE_MODEL_TYPE,
  ALARM_SOURCE_PROPERTY_NAME,
  ALARM_STATE_PROPERTY_NAME,
  ALARM_TYPE_PROPERTY_NAME,
} from '../constants';
import { AlarmData, AlarmDataStatus, AlarmProperty } from '../types';

/**
 * This function finds the alarm state, type, and source properties on a composite model if they exist.
 * A compositeModel from an asset or assetModel share the same shape for searching properties so this
 * function is generic for both.
 *
 * @param compositeModel is the asset or assetModel compositeModel
 * @returns the state, type, and source asset or assetModel properties
 */
export const getAlarmPropertiesFromCompositeModel = (
  compositeModel?: AssetCompositeModel | AssetModelCompositeModel
):
  | {
      state?: AssetProperty | AssetModelProperty;
      type?: AssetProperty | AssetModelProperty;
      source?: AssetProperty | AssetModelProperty;
    }
  | undefined => {
  if (isAlarmCompositeModel(compositeModel)) {
    let stateProperty: AssetProperty | AssetModelProperty | undefined;
    let typeProperty: AssetProperty | AssetModelProperty | undefined;
    let sourceProperty: AssetProperty | AssetModelProperty | undefined;

    compositeModel?.properties?.forEach((property) => {
      if (property.name === ALARM_STATE_PROPERTY_NAME) {
        stateProperty = property;
      } else if (property.name === ALARM_TYPE_PROPERTY_NAME) {
        typeProperty = property;
      } else if (property.name === ALARM_SOURCE_PROPERTY_NAME) {
        sourceProperty = property;
      }
    });

    return {
      state: stateProperty,
      type: typeProperty,
      source: sourceProperty,
    };
  }
};

/**
 * Checks whether a composite model is an AWS/ALARM type
 */
export const isAlarmCompositeModel = (
  compositeModel?: AssetCompositeModel | AssetModelCompositeModel
): boolean => {
  return compositeModel?.type === ALARM_COMPOSITE_MODEL_TYPE;
};

/**
 * Builds AlarmData for a provided compositeModel
 *
 * @param compositeModel is the asset or assetModel compositeModel
 * @param status is the query status for fetching the compositeModel
 * @returns an AlarmData object with content from the compositeModel
 */
export const buildFromCompositeModel = (
  compositeModel: AssetCompositeModel | AssetModelCompositeModel,
  status: AlarmDataStatus
) => {
  const alarmProperties = getAlarmPropertiesFromCompositeModel(compositeModel);
  const alarmData: AlarmData = {
    compositeModelId: compositeModel.id,
    compositeModelName: compositeModel.name,
    state: constructAlarmAssetModelProperty(alarmProperties?.state),
    type: constructAlarmAssetModelProperty(alarmProperties?.type),
    source: constructAlarmAssetModelProperty(alarmProperties?.source),
    status,
  };
  return alarmData;
};

/**
 * Builds an AlarmProperty with property and data values
 *
 * @param property is an asset or assetModel property
 * @param assetPropertyValue is an asset property value
 * @returns an AlarmProperty with property and data values
 */
export const constructAlarmAssetModelProperty = (
  property?: AssetModelProperty | AssetProperty,
  assetPropertyValue?: AssetPropertyValue
): AlarmProperty | undefined => {
  if (!property) return undefined;

  let data: AssetPropertyValue[] | undefined;
  if ((property as AssetModelProperty)?.type?.attribute?.defaultValue) {
    data = [
      {
        value: {
          /**
           * The only available data without an asset reference
           * for an AssetModelProperty is an attribute default value
           */
          stringValue: (property as AssetModelProperty)?.type?.attribute
            ?.defaultValue,
        },
        timestamp: undefined,
      },
    ];
  } else if (assetPropertyValue) {
    data = [assetPropertyValue];
  }

  return {
    property,
    data,
  };
};
