import {
  AssetCompositeModel,
  AssetModelCompositeModel,
  AssetModelProperty,
  AssetProperty,
} from '@aws-sdk/client-iotsitewise';
import {
  ALARM_COMPOSITE_MODEL_TYPE,
  ALARM_SOURCE_PROPERTY_NAME,
  ALARM_STATE_PROPERTY_NAME,
  ALARM_TYPE_PROPERTY_NAME,
} from '../constants';

/**
 * Finds the alarm state, type, and source properties on a composite model if they exist.
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
