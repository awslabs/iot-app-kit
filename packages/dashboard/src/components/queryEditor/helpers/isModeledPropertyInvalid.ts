import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export const isModeledPropertyInvalid = (
  dataType?: string,
  widgetType?: RegisteredWidgetType
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
