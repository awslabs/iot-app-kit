import React from 'react';
import { spaceScaledXxs } from '@cloudscape-design/design-tokens';

import {
  XYPlotTooltipDatastreamName,
  XYPlotTooltipDatastreamNameOptions,
} from './name';
import {
  XYPlotTooltipDatastreamColor,
  XYPlotTooltipDatastreamColorOptions,
} from './color';
import { ChartAlarms, ChartDataQuality } from '../../types';
import { XYPlotTooltipAlarm, XYPlotTooltipAlarmOptions } from './alarm';
import { AlarmContent } from '../../../alarm-components/alarm-content/types';

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
