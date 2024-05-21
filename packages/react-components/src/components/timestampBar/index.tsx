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

import './timestamp.css';
import { useViewport } from '../../hooks/useViewport';
import { convertViewportToMs } from '../../utils/convertViewportToMs';
import { DateTime } from '../timeZone';

type TimestampProps = {
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
}: TimestampProps) => {
  const { viewport } = useViewport();
  const { initial, end } = convertViewportToMs(viewport);
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
        <span>
          <DateTime dateTime={initial} />
        </span>
        <span>
          <DateTime dateTime={end} />
        </span>
      </div>
    </div>
  );
};
