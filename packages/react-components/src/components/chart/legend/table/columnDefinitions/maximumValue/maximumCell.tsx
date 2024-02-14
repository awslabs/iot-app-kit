import React, { useMemo } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { useDataStreamMaxMin } from '../../../../hooks/useDataStreamMaxMin';
import { DataStreamInformation } from '../../types';

export const MaximumCell = ({ id }: DataStreamInformation) => {
  const { isDataStreamHidden } = useVisibleDataStreams();
  const { dataStreamMaxes } = useDataStreamMaxMin();

  const max = dataStreamMaxes[id];

  const isVisible = useMemo(
    () => !isDataStreamHidden({ id: id } as DataStream),
    [isDataStreamHidden, id]
  );

  return (
    <div data-testid='max-value' className={!isVisible ? 'hidden-legend' : ''}>
      {max ?? '-'}
    </div>
  );
};
