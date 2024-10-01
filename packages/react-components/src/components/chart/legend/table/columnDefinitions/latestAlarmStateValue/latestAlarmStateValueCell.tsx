import React, { useMemo } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { DataStreamInformation } from '../../types';
import { AlarmStateText } from '../../../../../alarm-state/alarm-state-text';
import { PascalCaseStateName } from '../../../../../../hooks/useAlarms/transformers';

export const LatestAlarmStateValueCell = ({
  id,
  latestAlarmStateValue,
}: DataStreamInformation) => {
  const { isDataStreamHidden } = useVisibleDataStreams();

  const isVisible = useMemo(
    () => !isDataStreamHidden({ id: id } as DataStream),
    [isDataStreamHidden, id]
  );

  return (
    <div className={!isVisible ? 'hidden-legend' : ''}>
      {latestAlarmStateValue ? (
        <AlarmStateText state={latestAlarmStateValue as PascalCaseStateName} />
      ) : (
        '-'
      )}
    </div>
  );
};
