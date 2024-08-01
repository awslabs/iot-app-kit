import React from 'react';
import {
  colorBackgroundLayoutToggleActive,
  colorBorderDividerSecondary,
  colorTextBodyDefault,
} from '@cloudscape-design/design-tokens';
import { Spinner } from '@cloudscape-design/components';

import './timestamp.css';
import { convertViewportToMs } from '../../utils/convertViewportToMs';
import { Viewport } from '@iot-app-kit/core';
import { formatDate } from '../../utils/time';
import useDataStore from '../../store';

type TimestampProps = {
  viewport?: Viewport;
  showLoadingIndicator: boolean;
  isLoading?: boolean;
  styleProps: {
    width?: string | number;
    top?: string | number;
    marginLeft?: string | number;
    border?: string | number;
    bottom?: string | number;
  };
};

export const Timestamp = ({
  showLoadingIndicator,
  isLoading,
  styleProps,
  viewport,
}: TimestampProps) => {
  const { initial, end } = convertViewportToMs(viewport);
  const timeZone = useDataStore().timeZone;

  const timestampStart = formatDate(initial, {
    timeZone,
    pattern: "MM/dd/yyyy, hh:mm:ss aa '(UTC'x)'",
  });
  const timestampEnd = formatDate(end, {
    timeZone,
    pattern: "MM/dd/yyyy, hh:mm:ss aa '(UTC'x)'",
  });
  const timestampStyle = {
    ...styleProps,
    backgroundColor: showLoadingIndicator ? '' : colorBorderDividerSecondary,
    borderTop: `${2} solid ${colorBorderDividerSecondary}`,
    padding: showLoadingIndicator ? '0 12px 2px 8px' : '4px 8px',
    fontSize: `10px`,
    color: `${colorBackgroundLayoutToggleActive}`,
  };
  return (
    <div
      className='iot-app-kit-chart-timestamp-container'
      style={timestampStyle}
      data-testid='chart-timestamp-container'
    >
      {showLoadingIndicator && (
        <span style={{ minWidth: '12px' }}>{isLoading && <Spinner />}</span>
      )}

      <div
        className='chart-timestamp'
        style={{
          paddingTop: showLoadingIndicator ? '4px' : '0px',
          color: colorTextBodyDefault,
        }}
      >
        <span>{timestampStart}</span>
        <span>{timestampEnd}</span>
      </div>
    </div>
  );
};
