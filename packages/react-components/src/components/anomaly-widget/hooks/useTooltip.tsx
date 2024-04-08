import { useMemo } from 'react';
import { TooltipData, formatTooltip } from '../utils/formatTooltip';

const ANOMALY_TOOLTIP = {
  trigger: 'axis',
  axisPointer: {
    animation: false,
  },
};

export const useTooltip = ({
  decimalPlaces,
  tooltipSort,
}: {
  decimalPlaces?: number;
  tooltipSort?: 'value' | 'alphabetical';
}) => {
  return useMemo(() => {
    return {
      tooltip: {
        ...ANOMALY_TOOLTIP,
        formatter: (params: TooltipData) => {
          return formatTooltip(params, decimalPlaces, tooltipSort);
        },
      },
    };
  }, [decimalPlaces, tooltipSort]);
};
