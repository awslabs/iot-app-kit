import React, { useMemo } from 'react';
import { DataStreamInformation } from '../../types';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { DataStream } from '@iot-app-kit/core';

type TrendCursorCellOptions = Omit<
  DataStreamInformation,
  | 'trendCursorValues'
  | 'maxValue'
  | 'minValue'
  | 'latestValue'
  | 'latestAlarmStateValue'
> & { trendCursorValue?: number };

export const TrendCursorCell = ({
  id,
  trendCursorValue,
}: TrendCursorCellOptions) => {
  const { isDataStreamHidden } = useVisibleDataStreams();

  const isVisible = useMemo(
    () => !isDataStreamHidden({ id } as DataStream),
    [isDataStreamHidden, id]
  );

  const value = trendCursorValue === undefined ? '-' : trendCursorValue;

  return (
    <div className={`trend-cursor-value ${!isVisible ? 'hidden-legend' : ''}`}>
      {value}
    </div>
  );
};
