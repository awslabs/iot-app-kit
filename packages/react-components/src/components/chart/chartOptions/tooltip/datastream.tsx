import {
  XYPlotTooltipDatastreamLabel,
  type XYPlotTooltipDatastreamLabelOptions,
} from './datastreamLabel';
import { XYPlotTooltipValue, type XYPlotTooltipValueOptions } from './value';
import { type ChartAlarms, type ChartDataQuality } from '../../types';
import { type XYPlotTooltipAlarmOptions } from './alarm';
import { type AlarmContent } from '../../../alarm-components/alarm-content/types';

export type XYPlotTooltipDatastreamOptions =
  XYPlotTooltipDatastreamLabelOptions &
    XYPlotTooltipValueOptions &
    XYPlotTooltipAlarmOptions &
    ChartDataQuality &
    ChartAlarms;

export const XYPlotTooltipDatastream = (
  props: XYPlotTooltipDatastreamOptions
) => {
  const {
    name,
    color,
    quality,
    value,
    significantDigits,
    showBadDataIcons,
    showUncertainDataIcons,
  } = props;

  const alarmContent: AlarmContent = {
    alarmState: props.alarmState,
    alarmName: props.alarmName,
    assetId: props.assetId,
    alarmExpression: props.alarmExpression,
    severity: props.severity,
  };

  return (
    <>
      <XYPlotTooltipDatastreamLabel
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
        showAlarmIcons={props.showAlarmIcons}
        name={name}
        quality={quality}
        color={color}
        {...alarmContent}
      />
      <XYPlotTooltipValue significantDigits={significantDigits} value={value} />
    </>
  );
};
