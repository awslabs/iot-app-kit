import type {
  AssetModelProperty,
  AssetProperty,
  AssetPropertyValue,
} from '@aws-sdk/client-iotsitewise';
import type { AlarmProperty } from '../types';

/**
 * Creates an AlarmProperty with property and data values
 *
 * @param property is an asset or assetModel property
 * @param assetPropertyValue is an asset property value
 * @returns an AlarmProperty with property and data values
 */
export const constructAlarmProperty = (
  property?: AssetModelProperty | AssetProperty,
  assetPropertyValue?: AssetPropertyValue
): AlarmProperty | undefined => {
  if (!property) return undefined;

  let data: AssetPropertyValue[] | undefined;
  if ((property as AssetModelProperty)?.type?.attribute?.defaultValue) {
    data = [
      {
        value: {
          // The only available data without an asset reference
          // for an AssetModelProperty is an attribute default value
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
