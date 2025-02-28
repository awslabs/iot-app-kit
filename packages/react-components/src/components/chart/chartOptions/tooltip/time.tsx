import { fontWeightHeadingS } from '@cloudscape-design/design-tokens';
import { FULL_DATE, formatDate } from '@iot-app-kit/core';
import useDataStore from '../../../../store';

export type XYPlotTooltipTimeOptions = {
  time?: number;
};

export const XYPlotTooltipTime = ({ time }: XYPlotTooltipTimeOptions) => {
  const timeZone = useDataStore().timeZone;
  return (
    <span style={{ fontWeight: fontWeightHeadingS }}>
      {time
        ? formatDate(time, {
            pattern: FULL_DATE,
            timeZone,
          })
        : ''}
    </span>
  );
};
