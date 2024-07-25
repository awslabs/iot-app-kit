import type { PropertyDataType } from '@aws-sdk/client-iotsitewise';

export const isModeledPropertyInvalid = (
  dataType?: PropertyDataType,
  widgetType?: string
) => {
  if (!widgetType || !dataType) return false;

  const isNumericDataType = dataType === 'DOUBLE' || dataType === 'INTEGER';

  if (
    widgetType === 'xy-plot' ||
    widgetType === 'bar-chart' ||
    widgetType === 'gauge'
  ) {
    return !isNumericDataType;
  }

  return false;
};
