import React from 'react';
import { DEFAULT_KPI_SETTINGS, DEFAULT_KPI_COLOR, KPI_ICON_SHRINK_FACTOR } from './constants';
import { LoadingSpinner, ErrorBadge, StatusIcon, Value } from '../shared-components';
import omitBy from 'lodash.omitby';
import type { KPIProperties, KPISettings } from './types';

export const KpiBase: React.FC<KPIProperties> = ({
  icon,
  propertyPoint,
  alarmPoint,
  error,
  unit,
  name,
  isLoading,
  color = DEFAULT_KPI_COLOR,
  settings = {},
}) => {
  const { showName, showUnit, showIcon, showTimestamp, fontSize, secondaryFontSize }: KPISettings = {
    ...DEFAULT_KPI_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  // Primary point to display. KPI Emphasizes the property point over the alarm point.
  const point = propertyPoint || alarmPoint;

  return (
    <div className='kpi' style={{ fontSize: `${secondaryFontSize}px` }}>
      {showName && name}
      {error && <ErrorBadge>{error}</ErrorBadge>}
      <div>
        {isLoading && <LoadingSpinner size={fontSize} />}
        {!isLoading && showIcon && icon && (
          <StatusIcon name={icon} size={fontSize * KPI_ICON_SHRINK_FACTOR} color={color} />
        )}
        {!isLoading && (
          <span style={{ color, fontSize: `${fontSize}px` }}>
            <Value value={point ? point.y : undefined} unit={showUnit ? unit : undefined} />
          </span>
        )}
      </div>
      {point && !isLoading && showTimestamp && new Date(point.x).toLocaleString()}
    </div>
  );
};
