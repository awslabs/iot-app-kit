import { useMemo } from 'react';
import { type DataStream } from '@iot-app-kit/core';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { type DataStreamInformation } from '../../types';
import { AlarmStateText } from '../../../../../alarm-components/alarm-state/alarmStateText';
import { type PascalCaseStateName } from '@iot-app-kit/component-core';

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
        <AlarmStateText
          alarmState={latestAlarmStateValue as PascalCaseStateName}
        />
      ) : (
        '-'
      )}
    </div>
  );
};
