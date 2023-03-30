import React from 'react';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import * as cloudscape from '@cloudscape-design/design-tokens';

import { StatusIcon, Value } from '../shared-components';
import { highContrastColor } from './highContrastColor';
import { DEFAULT_STATUS_SETTINGS, DEFAULT_STATUS_COLOR, STATUS_ICON_SHRINK_FACTOR } from './constants';
import { DEFAULT_MESSAGE_OVERRIDES } from '../../common/dataTypes';
import omitBy from 'lodash.omitby';
import styled from 'styled-components';
import type { StatusProperties, StatusSettings } from './types';

const StatusWidget = styled.div`
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
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
  const { showName, showUnit, showValue, showIcon, fontSize, secondaryFontSize }: StatusSettings = {
    ...DEFAULT_STATUS_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  // Primary point to display
  const point = alarmPoint || propertyPoint;

  const backgroundColor = color;
  const foregroundColor = highContrastColor(backgroundColor);

  /** Display Settings. We want to dynamically construct the layout dependent on what information is shown */
  const emphasizeValue = !showValue;

  const displayedUnit = showUnit && alarmPoint == null ? unit : undefined;
  return (
    <StatusWidget
      data-testid='status-widget'
      className='status-widget'
      style={{
        backgroundColor,
        color: foregroundColor,
        justifyContent: emphasizeValue ? 'center' : 'unset',
        fontSize: `${fontSize}px`,
        padding: cloudscape.spaceStaticM,
      }}
    >
      {showName && <span style={{ fontSize: `${secondaryFontSize}px` }}>{name}</span>}

      {error && (
        <Box margin={{ top: 's', bottom: 's' }}>
          <Alert statusIconAriaLabel='Error' type='error'>
            {error}
          </Alert>
        </Box>
      )}
      {isLoading && <Spinner data-testid='loading' size='large' />}

      {!emphasizeValue && !isLoading && <Divider />}
      {showValue && point && !isLoading && (
        <div>
          {alarmPoint && propertyPoint && (
            <Box fontSize='heading-s'>
              <span style={{ color: foregroundColor }}>
                {DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel}:{' '}
                <Value value={propertyPoint ? propertyPoint.y : undefined} unit={showUnit ? unit : undefined} />
              </span>
            </Box>
          )}
          {showIcon && icon && (
            <StatusIcon
              name={icon}
              size={fontSize * STATUS_ICON_SHRINK_FACTOR}
              color={highContrastColor(backgroundColor)}
            />
          )}
          <Value value={point?.y} unit={displayedUnit} />
        </div>
      )}
    </StatusWidget>
  );
};
