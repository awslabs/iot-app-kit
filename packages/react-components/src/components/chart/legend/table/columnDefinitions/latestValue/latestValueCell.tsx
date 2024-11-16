import { useMemo } from 'react';
import { type DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { type DataStreamInformation } from '../../types';

export const LatestValueCell = ({ id, latestValue }: DataStreamInformation) => {
  const { isDataStreamHidden } = useVisibleDataStreams();

  const isVisible = useMemo(
    () => !isDataStreamHidden({ id: id } as DataStream),
    [isDataStreamHidden, id]
  );

  return (
    <div className={!isVisible ? 'hidden-legend' : ''}>
      {latestValue ?? '-'}
    </div>
  );
};
