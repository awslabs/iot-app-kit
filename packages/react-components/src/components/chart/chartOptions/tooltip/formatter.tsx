import React from 'react';
import { renderToString } from 'react-dom/server';
import { DataPoint } from '@iot-app-kit/core';
import {
  TooltipFormatterCallback,
  TopLevelFormatterParams,
} from 'echarts/types/dist/shared';
import { XYPlotTooltip } from './tooltip';
import { ChartAlarms, ChartDataQuality } from '../../types';
import { AlarmContent } from '../../../alarm-components/alarm-content/types';
import { PascalCaseStateName } from '@iot-app-kit/source-iotsitewise/dist/es/alarms/iotevents';

type FormatterOptions = {
  significantDigits?: number;
  colorMap: { [key in string]: string };
} & ChartDataQuality & ChartAlarms;
export const formatter =
  ({
    significantDigits,
    colorMap = {},
    showBadDataIcons,
    showUncertainDataIcons,
    showAlarmIcons,
  }: FormatterOptions): TooltipFormatterCallback<TopLevelFormatterParams> =>
  (params) => {
    const normalizedParams = Array.isArray(params) ? params : [params];

    const time = (normalizedParams.at(0)?.data as DataPoint | undefined)?.x;

    const datastreams = normalizedParams.map((param) => {
      const dataPoint = param.data as DataPoint | undefined;
      const id = param.seriesId ?? '';
      const color = colorMap[id];
      const value = dataPoint?.y;
      const name = param.seriesName;
      const quality = dataPoint?.quality;

      let alarmContent: AlarmContent | undefined;
      if (typeof param.value === 'object') {
        const alarmName =
          'alarmName' in param.value
            ? (param.value.alarmName as string)
            : undefined;
        const alarmExpression =
          'alarmExpression' in param.value
            ? (param.value.alarmExpression as string)
            : undefined;
        const assetId =
          'assetId' in param.value
            ? (param.value.assetId as string)
            : undefined;
        const severity =
          'severity' in param.value
            ? (param.value.severity as number)
            : undefined;
        const alarmState =
          'alarmState' in param.value
            ? (param.value.alarmState as PascalCaseStateName)
            : undefined;
        alarmContent = {
          alarmName,
          alarmExpression,
          assetId,
          severity,
          alarmState,
        };
      }

      return {
        color,
        name,
        value,
        significantDigits,
        quality,
        id,
        ...alarmContent,
      };
    });

    return renderToString(
      <XYPlotTooltip
        time={time}
        datastreams={datastreams}
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
        showAlarmIcons={showAlarmIcons}
      />
    );
  };
