import React from 'react';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import omitBy from 'lodash.omitby';

import { DEFAULT_KPI_SETTINGS, DEFAULT_KPI_COLOR, KPI_ICON_SHRINK_FACTOR } from './constants';
import { StatusIcon, Value } from '../shared-components';
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
  const displayedUnit = showUnit ? unit : undefined;
  return (
    <div className='kpi' style={{ fontSize: `${secondaryFontSize}px` }}>
      {showName && name}
      {error && (
        <Box margin={{ vertical: 's' }}>
          <Alert statusIconAriaLabel='Error' type='error'>
            {error}
          </Alert>
        </Box>
      )}
      <div>
        {isLoading && <Spinner data-testid='loading' />}
        {!isLoading && showIcon && icon && (
          <StatusIcon name={icon} size={fontSize * KPI_ICON_SHRINK_FACTOR} color={color} />
        )}
        {!isLoading && (
          <span style={{ color, fontSize: `${fontSize}px` }}>
            <Value value={point?.y} unit={displayedUnit} />
          </span>
        )}
      </div>
      {point && !isLoading && showTimestamp && new Date(point.x).toLocaleString()}
    </div>
  );
};
