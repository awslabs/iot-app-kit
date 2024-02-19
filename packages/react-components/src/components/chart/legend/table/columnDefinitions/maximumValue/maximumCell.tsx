import React, { useMemo } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { DataStreamInformation } from '../../types';

export const MaximumCell = ({ id, maxValue }: DataStreamInformation) => {
  const { isDataStreamHidden } = useVisibleDataStreams();

  const isVisible = useMemo(
    () => !isDataStreamHidden({ id: id } as DataStream),
    [isDataStreamHidden, id]
  );

  return (
    <div data-testid='max-value' className={!isVisible ? 'hidden-legend' : ''}>
      {maxValue ?? '-'}
    </div>
  );
};
