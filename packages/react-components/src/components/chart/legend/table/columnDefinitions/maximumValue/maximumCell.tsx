import { useMemo } from 'react';
import { type DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { type DataStreamInformation } from '../../types';

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
