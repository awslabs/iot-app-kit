import React, { useMemo } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { DataStreamInformation } from '../../types';

export const MinimumCell = ({ id, minValue }: DataStreamInformation) => {
  const { isDataStreamHidden } = useVisibleDataStreams();

  const isVisible = useMemo(
    () => !isDataStreamHidden({ id: id } as DataStream),
    [isDataStreamHidden, id]
  );

  return (
    <div data-testid='min-value' className={!isVisible ? 'hidden-legend' : ''}>
      {minValue ?? '-'}
    </div>
  );
};
