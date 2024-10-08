import { useCallback, useMemo, useReducer } from 'react';
import { alarmsStateReducer } from './reducer';
import {
  SummarizeAlarmActionPayload,
  onSummarizeAlarmAction,
  onUpdateAlarmSourceDataAction,
} from './actions';
import { convertAlarmsStateToAlarmDatas } from './converter';
import { UpdateAlarmSourceDataActionPayload } from './actions/updateAlarmSourceData/types';

export const useAlarmsState = () => {
  const [state, dispatch] = useReducer(alarmsStateReducer, { alarms: [] });

  const onSummarizeAlarms = useCallback(
    (payload: SummarizeAlarmActionPayload) => {
      dispatch(onSummarizeAlarmAction(payload));
    },
    [dispatch]
  );

  const onUpdateAlarmSourceData = useCallback(
    (payload: UpdateAlarmSourceDataActionPayload) => {
      dispatch(onUpdateAlarmSourceDataAction(payload));
    },
    [dispatch]
  );

  const alarmDatas = useMemo(
    () => convertAlarmsStateToAlarmDatas(state),
    [state]
  );

  return {
    alarmDatas,
    state,
    onSummarizeAlarms,
    onUpdateAlarmSourceData,
  };
};

type UseAlarmsStateReturnValues = ReturnType<typeof useAlarmsState>;

export type OnSummarizeAlarmAction =
  UseAlarmsStateReturnValues['onSummarizeAlarms'];

export type OnUpdateAlarmSourceDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmSourceData'];
