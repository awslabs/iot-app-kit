import React from 'react';
import { DEFAULT_STATUS_SETTINGS, DEFAULT_STATUS_COLOR, STATUS_ICON_SHRINK_FACTOR } from './constants';

import { ErrorBadge, LoadingSpinner, StatusIcon, Value } from '../shared-components';
import { highContrastColor } from './highContrastColor';
import { DEFAULT_MESSAGE_OVERRIDES } from '../../common/dataTypes';
import omitBy from 'lodash.omitby';
import styled from 'styled-components';
import type { StatusProperties, StatusSettings } from './types';

const StatusWidget = styled.div`
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--margin-medium);
  font-size: var(--font-size-3);
  line-height: var(--line-height-3);
`;

const Secondary = styled.div`
  font-size: var(--font-size-1);
  line-height: var(--line-height-1);
  font-weight: var(--font-weight-light);
`;

const ValueContainer = styled.div`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-3);
  line-height: var(--line-height-3);
`;

const Spacer = styled.div`
  width: 4px;
  display: inline-block;
`;

const Divider = styled.div`
  flex-grow: 1;
`;

export const StatusBase: React.FC<StatusProperties> = ({
  icon,
  error,
  isLoading,
  propertyPoint,
  alarmPoint,
  unit,
  name,
  color = DEFAULT_STATUS_COLOR,
  settings = {},
}) => {
  const { showName, showUnit, showValue, showIcon, fontSize }: StatusSettings = {
    ...DEFAULT_STATUS_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  // Primary point to display
  const point = alarmPoint || propertyPoint;

  const backgroundColor = color;
  const foregroundColor = highContrastColor(backgroundColor);

  /** Display Settings. We want to dynamically construct the layout dependent on what information is shown */
  const emphasizeValue = !showValue;

  /** If anything is emphasized, then something is emphasized */

  return (
    <StatusWidget
      data-testid='status-widget'
      className='status-widget'
      style={{
        backgroundColor,
        color: foregroundColor,
        justifyContent: emphasizeValue ? 'center' : 'unset',
      }}
    >
      {showName && name}
      {error && <ErrorBadge>{error}</ErrorBadge>}
      {isLoading && <LoadingSpinner size={fontSize} />}

      {!emphasizeValue && !isLoading && <Divider />}
      {showValue && point && !isLoading && (
        <div>
          {alarmPoint && propertyPoint && (
            <Secondary style={{ color: foregroundColor }}>
              {DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel}:{' '}
              <Value value={propertyPoint ? propertyPoint.y : undefined} unit={showUnit ? unit : undefined} />
            </Secondary>
          )}
          <div style={{ color: foregroundColor, display: 'flex' }}>
            {showIcon && icon && (
              <>
                <StatusIcon
                  name={icon}
                  size={fontSize * STATUS_ICON_SHRINK_FACTOR}
                  color={highContrastColor(backgroundColor)}
                />
                <Spacer />
              </>
            )}
            <ValueContainer>
              <Value value={point ? point.y : undefined} unit={showUnit && alarmPoint == null ? unit : undefined} />
            </ValueContainer>
          </div>
        </div>
      )}
    </StatusWidget>
  );
};
