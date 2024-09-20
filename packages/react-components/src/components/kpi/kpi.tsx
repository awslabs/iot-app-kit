import React from 'react';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { DEFAULT_VIEWPORT } from '../../common/constants';
import type {
  StyleSettingsMap,
  Viewport,
  StyledThreshold,
} from '@iot-app-kit/core';
import type { KPISettings } from './types';
import { KpiBase } from './kpiBase';
import type { ComponentQuery } from '../../common/chartTypes';
import { getTimeSeriesQueries } from '../../utils/queries';

export const KPI = ({
  query,
  viewport: passedInViewport,
  thresholds = [],
  styles,
  settings,
  significantDigits,
  timeZone,
}: {
  query: ComponentQuery;
  viewport?: Viewport;
  thresholds?: StyledThreshold[];
  styles?: StyleSettingsMap;
  aggregationType?: string;
  settings?: Partial<KPISettings>;
  significantDigits?: number;
  timeZone?: string;
}) => {
  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: getTimeSeriesQueries([query]),
    settings: {
      fetchMostRecentBeforeEnd: true,
    },
    styles,
  });
  const { viewport } = useViewport();

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  const {
    propertyPoint,
    alarmPoint,
    propertyThreshold,
    alarmStream,
    propertyStream,
    propertyResolution,
  } = widgetPropertiesFromInputs({
    dataStreams,
    thresholds: [...queryThresholds, ...thresholds],
    viewport: utilizedViewport,
  });

  const name = propertyStream?.name || alarmStream?.name;
  const unit = propertyStream?.unit || alarmStream?.unit;
  const backgroundColor = settings?.color || settings?.backgroundColor;
  const isLoading =
    alarmStream?.isLoading || propertyStream?.isLoading || false;
  const error = alarmStream?.error || propertyStream?.error;

  return (
    <KpiBase
      propertyPoint={propertyPoint}
      alarmPoint={alarmPoint}
      settings={{ ...settings, backgroundColor }}
      propertyThreshold={propertyThreshold}
      aggregationType={dataStreams[0]?.aggregationType}
      resolution={propertyResolution}
      name={name}
      unit={unit}
      isLoading={isLoading}
      error={error?.msg}
      significantDigits={significantDigits}
      timeZone={timeZone}
    />
  );
};
