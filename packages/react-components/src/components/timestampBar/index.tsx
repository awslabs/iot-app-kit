import React from 'react';
import {
  colorBackgroundLayoutToggleActive,
  colorBorderDividerSecondary,
  colorTextBodyDefault,
  spaceStaticS,
  spaceStaticXl,
  spaceStaticXs,
  spaceStaticXxs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import { Spinner } from '@cloudscape-design/components';
import { format } from 'date-fns';

import './timestamp.css';
import { convertViewportToMs } from '../../utils/convertViewportToMs';
import { Viewport } from '@iot-app-kit/core';

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
  const timestampStart = format(
    new Date(initial),
    "MM/dd/yyyy, kk:mm:ss aa '(UTC'x')'"
  );
  const timestampEnd = format(
    new Date(end),
    "MM/dd/yyyy, kk:mm:ss aa '(UTC'x')'"
  );
  const timestampStyle = {
    ...styleProps,
    backgroundColor: showLoadingIndicator ? '' : colorBorderDividerSecondary,
    borderTop: `${spaceStaticXxxs} solid ${colorBorderDividerSecondary}`,
    padding: showLoadingIndicator
      ? `0 ${spaceStaticS} ${spaceStaticXxxs} ${spaceStaticXs}`
      : `${spaceStaticXxs} ${spaceStaticXs}`,
    fontSize: `10px`,
    color: `${colorBackgroundLayoutToggleActive}`,
  };
  return (
    <div
      className='chart-timestamp-container'
      style={timestampStyle}
      data-testid='chart-timestamp-container'
    >
      {showLoadingIndicator && (
        <span style={{ minWidth: spaceStaticXl }}>
          {isLoading && <Spinner />}
        </span>
      )}

      <div
        className='chart-timestamp'
        style={{
          paddingTop: showLoadingIndicator ? spaceStaticXxs : 0,
          color: colorTextBodyDefault,
        }}
      >
        <span>{timestampStart}</span>
        <span>{timestampEnd}</span>
      </div>
    </div>
  );
};
