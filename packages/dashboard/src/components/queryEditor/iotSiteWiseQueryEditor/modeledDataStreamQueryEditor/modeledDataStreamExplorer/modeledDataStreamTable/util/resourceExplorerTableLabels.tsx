import { ModeledDataStream } from '../../types';

export const isInValidProperty = (dataType: ModeledDataStream['dataType'], widgetType?: string) => {
  if (!widgetType || !dataType) return false;

  const isNumericDataType = dataType === 'DOUBLE' || dataType === 'INTEGER';

  if (widgetType === 'xy-plot' || widgetType === 'bar-chart') {
    return !isNumericDataType;
  }

  return false;
};
