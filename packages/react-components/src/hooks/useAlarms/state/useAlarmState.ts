import { useCallback, useMemo, useReducer } from 'react';
import { alarmsStateReducer } from './reducer';
import {
  SummarizeAlarmActionPayload,
  onSummarizeAlarmAction,
  onUpdateAlarmSourceDataAction,
} from './actions';
import { convertAlarmsStateToAlarmDatas } from './converter';
import { UpdateAlarmSourceDataActionPayload } from './actions/updateAlarmSourceData/types';
import { UpdateAlarmTypeDataActionPayload } from './actions/updateAlarmTypeData/types';
import { onUpdateAlarmTypeDataAction } from './actions/updateAlarmTypeData';

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

  const onUpdateAlarmTypeData = useCallback(
    (payload: UpdateAlarmTypeDataActionPayload) => {
      dispatch(onUpdateAlarmTypeDataAction(payload));
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
    onUpdateAlarmTypeData,
  };
};

type UseAlarmsStateReturnValues = ReturnType<typeof useAlarmsState>;

export type OnSummarizeAlarmAction =
  UseAlarmsStateReturnValues['onSummarizeAlarms'];

export type OnUpdateAlarmSourceDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmSourceData'];

export type OnUpdateAlarmTypeDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmTypeData'];
