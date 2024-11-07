import { XYPlotTooltipTime, type XYPlotTooltipTimeOptions } from './time';
import {
  XYPlotTooltipDatastreams,
  type XYPlotTooltipDatastreamsOptions,
} from './datastreams';
import { type ChartAlarms, type ChartDataQuality } from '../../types';

export type XYPlotTooltipOptions = XYPlotTooltipTimeOptions &
  XYPlotTooltipDatastreamsOptions &
  ChartDataQuality &
  ChartAlarms;
export const XYPlotTooltip = ({
  time,
  datastreams,
  showBadDataIcons,
  showUncertainDataIcons,
  showAlarmIcons,
}: XYPlotTooltipOptions) => {
  return (
    <div role='tooltip'>
      <XYPlotTooltipTime time={time} />
      <XYPlotTooltipDatastreams
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
        showAlarmIcons={showAlarmIcons}
        datastreams={datastreams}
      />
    </div>
  );
};
