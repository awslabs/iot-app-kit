import { useMemo } from 'react';
import { TooltipData, formatTooltip } from '../utils/formatTooltip';

const L4E_TOOLTIP = {
  trigger: 'axis',
  axisPointer: {
    animation: false,
  },
};

export const useTooltip = ({ decimalPlaces }: { decimalPlaces?: number }) => {
  return useMemo(() => {
    return {
      tooltip: {
        ...L4E_TOOLTIP,
        formatter: (data: TooltipData) => formatTooltip(data, decimalPlaces),
      },
    };
  }, [decimalPlaces]);
};
