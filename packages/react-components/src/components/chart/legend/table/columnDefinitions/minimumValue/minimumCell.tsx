import React, { useMemo } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { useDataStreamMaxMin } from '../../../../hooks/useDataStreamMaxMin';
import { DataStreamInformation } from '../../types';

export const MinimumCell = ({ id }: DataStreamInformation) => {
  const { isDataStreamHidden } = useVisibleDataStreams();
  const { dataStreamMins } = useDataStreamMaxMin();

  const min = dataStreamMins[id];

  const isVisible = useMemo(
    () => !isDataStreamHidden({ id: id } as DataStream),
    [isDataStreamHidden, id]
  );

  return (
    <div data-testid='min-value' className={!isVisible ? 'hidden-legend' : ''}>
      {min ?? '-'}
    </div>
  );
};
