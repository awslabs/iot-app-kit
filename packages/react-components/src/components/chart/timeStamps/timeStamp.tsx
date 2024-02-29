import React from 'react';
import {
  colorBackgroundLayoutToggleActive,
  colorTextHomeHeaderDefault,
  spaceStaticS,
  spaceStaticXl,
  spaceStaticXs,
  spaceStaticXxs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import { Spinner } from '@cloudscape-design/components';

import '../chart.css';

type TimestampProps = {
  showLoadingIndicator: boolean;
  start: string;
  end: string;
  styleProps: {
    width: number;
    top: number;
    marginLeft?: string;
  };
};

export const Timestamp = ({
  showLoadingIndicator,
  start,
  end,
  styleProps,
}: TimestampProps) => {
  const timestampStyle = {
    ...styleProps,
    borderTop: `${spaceStaticXxxs} solid ${colorTextHomeHeaderDefault}`,
    padding: `0 ${spaceStaticS} ${spaceStaticXxxs} ${spaceStaticXs}`,
    fontSize: `10px`,
    color: `${colorBackgroundLayoutToggleActive}`,
  };
  return (
    <div className='base-chart-timestamp-container' style={timestampStyle}>
      <span style={{ minWidth: spaceStaticXl }}>
        {showLoadingIndicator && <Spinner />}
      </span>

      <div
        className='base-chart-timestamp'
        style={{
          paddingTop: spaceStaticXxs,
        }}
      >
        <span>{start}</span>
        <span>{end}</span>
      </div>
    </div>
  );
};
