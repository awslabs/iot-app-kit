export const removeBackticks = (value: string) => {
  return value.replace(/^`|`$/g, '');
};

export const SITE_WISE_BACKED_PROPERTY_PREFIX = '$sitewise';

export const isBackedBySiteWiseAssetProperty = (maybeAssetProperty: string): boolean =>
  maybeAssetProperty.startsWith(SITE_WISE_BACKED_PROPERTY_PREFIX);

/**
 * Extracts the propertyId from an iot events expressions
 *
 * $sitewise.assetModel.`assetModelId`.`propertyId`.propertyValue.value
 *
 * "In AWS IoT Events, you use expressions to specify values in alarm models"
 *
 * More on that here https://docs.aws.amazon.com/iot-sitewise/latest/userguide/define-iot-events-alarm-cli.html
 */
export const getPropertyId = (modelPropertyId: string | undefined): string | undefined => {
  if (modelPropertyId == null) {
    return undefined;
  }

  if (!isBackedBySiteWiseAssetProperty(modelPropertyId)) {
    return undefined;
  }

  const splitInputProperty = modelPropertyId.split('.');

  return removeBackticks(splitInputProperty[3]);
};
