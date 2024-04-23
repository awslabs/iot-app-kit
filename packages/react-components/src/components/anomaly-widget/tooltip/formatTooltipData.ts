import { TooltipSort } from '../types';

// This is what comes from echarts formatter
export type AnomalyWidgetTooltipData = {
  componentSubType: string;
  axisValueLabel: string;
  seriesName: string;
  seriesId: string; // used to figure out the dimension
  color: string;
  dimensionNames: string[];
  value?: Record<string, number> | Array<number>;
};

export type FormatTooltipDataOptions = {
  data: AnomalyWidgetTooltipData[];
  tooltipSort?: TooltipSort;
};

const getDiagnosticValue = ({
  value,
  dimensionNames,
  seriesId,
}: Pick<AnomalyWidgetTooltipData, 'value' | 'seriesId' | 'dimensionNames'>) => {
  if (Array.isArray(value)) {
    const dimensionIndex = dimensionNames.findIndex(
      (name) => name === seriesId
    );
    return value[dimensionIndex] ?? 0;
  }
  return (value && value[seriesId]) ?? 0;
};

export const formatTooltipData = ({
  data,
  tooltipSort,
}: FormatTooltipDataOptions) =>
  data
    .map(
      ({
        color,
        seriesName,
        seriesId,
        value,
        dimensionNames,
        axisValueLabel,
      }) => ({
        id: seriesId,
        name: seriesName,
        color,
        value: getDiagnosticValue({ value, dimensionNames, seriesId }),
        date: axisValueLabel,
      })
    )
    .sort((a, b) => {
      if (tooltipSort === 'alphabetical') return a.name.localeCompare(b.name);

      return b.value - a.value;
    });
