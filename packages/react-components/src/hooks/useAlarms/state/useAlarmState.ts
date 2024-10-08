import { useCallback, useMemo, useReducer } from 'react';
import { alarmsStateReducer } from './reducer';
import {
  SummarizeAlarmActionPayload,
  onSummarizeAlarmAction,
  onSummarizeAlarmModelsAction,
  onUpdateAlarmSourceDataAction,
} from './actions';
import { convertAlarmsStateToAlarmDatas } from './converter';
import { UpdateAlarmSourceDataActionPayload } from './actions/updateAlarmSourceData/types';
import { UpdateAlarmTypeDataActionPayload } from './actions/updateAlarmTypeData/types';
import { onUpdateAlarmTypeDataAction } from './actions/updateAlarmTypeData';
import { SummarizeAlarmModelsActionPayload } from './actions/summarizeAlarmModels/types';
import { onUpdateAlarmInputDataAction } from './actions/updateAlarmInputPropertyData';
import { UpdateAlarmInputDataActionPayload } from './actions/updateAlarmInputPropertyData/types';

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

  const onSummarizeAlarmModels = useCallback(
    (payload: SummarizeAlarmModelsActionPayload) => {
      dispatch(onSummarizeAlarmModelsAction(payload));
    },
    [dispatch]
  );

  const onUpdateAlarmInputPropertyData = useCallback(
    (payload: UpdateAlarmInputDataActionPayload) => {
      dispatch(onUpdateAlarmInputDataAction(payload));
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
    onSummarizeAlarmModels,
    onUpdateAlarmInputPropertyData,
  };
};

type UseAlarmsStateReturnValues = ReturnType<typeof useAlarmsState>;

export type OnSummarizeAlarmAction =
  UseAlarmsStateReturnValues['onSummarizeAlarms'];

export type OnUpdateAlarmSourceDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmSourceData'];

export type OnUpdateAlarmTypeDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmTypeData'];

export type OnSummarizeAlarmModelsAction =
  UseAlarmsStateReturnValues['onSummarizeAlarmModels'];

export type OnUpdateAlarmInputDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmInputPropertyData'];
