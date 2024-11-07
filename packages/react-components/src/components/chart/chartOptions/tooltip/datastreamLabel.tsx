import { spaceScaledXxs } from '@cloudscape-design/design-tokens';

import {
  XYPlotTooltipDatastreamName,
  type XYPlotTooltipDatastreamNameOptions,
} from './name';
import {
  XYPlotTooltipDatastreamColor,
  type XYPlotTooltipDatastreamColorOptions,
} from './color';
import { type ChartAlarms, type ChartDataQuality } from '../../types';
import { XYPlotTooltipAlarm, type XYPlotTooltipAlarmOptions } from './alarm';
import { type AlarmContent } from '../../../alarm-components/alarm-content/types';

export type XYPlotTooltipDatastreamLabelOptions =
  XYPlotTooltipDatastreamNameOptions &
    XYPlotTooltipDatastreamColorOptions &
    XYPlotTooltipAlarmOptions &
    ChartDataQuality &
    ChartAlarms;

export const XYPlotTooltipDatastreamLabel = (
  props: XYPlotTooltipDatastreamLabelOptions
) => {
  const { name, color, quality, showBadDataIcons, showUncertainDataIcons } =
    props;

  const alarmContent: AlarmContent = {
    alarmState: props.alarmState,
    alarmName: props.alarmName,
    assetId: props.assetId,
    alarmExpression: props.alarmExpression,
    severity: props.severity,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'start',
          gap: spaceScaledXxs,
        }}
      >
        <XYPlotTooltipDatastreamColor color={color} />
        <XYPlotTooltipDatastreamName
          showBadDataIcons={showBadDataIcons}
          showUncertainDataIcons={showUncertainDataIcons}
          name={name}
          quality={quality}
        />
      </div>
      {props.showAlarmIcons ? <XYPlotTooltipAlarm {...alarmContent} /> : null}
    </div>
  );
};
