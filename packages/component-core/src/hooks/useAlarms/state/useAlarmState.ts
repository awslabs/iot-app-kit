import { useCallback, useMemo, useReducer } from 'react';
import { alarmsStateReducer } from './reducer';
import {
  onSummarizeAlarmAction,
  onSummarizeAlarmModelsAction,
  onUpdateAlarmSourceDataAction,
  type SummarizeAlarmActionPayload,
} from './actions';
import { type UpdateAlarmSourceDataActionPayload } from './actions/updateAlarmSourceData/types';
import { type UpdateAlarmTypeDataActionPayload } from './actions/updateAlarmTypeData/types';
import { onUpdateAlarmTypeDataAction } from './actions/updateAlarmTypeData';
import { type SummarizeAlarmModelsActionPayload } from './actions/summarizeAlarmModels/types';
import { onUpdateAlarmInputDataAction } from './actions/updateAlarmInputPropertyData';
import { type UpdateAlarmInputDataActionPayload } from './actions/updateAlarmInputPropertyData/types';
import { type UpdateAlarmStateDataActionPayload } from './actions/updateAlarmStateData/types';
import { onUpdateAlarmStateDataAction } from './actions/updateAlarmStateData/updateAlarmStateData';
import { type UpdateAlarmThresholdDataActionPayload } from './actions/updateAlarmThresholdData/types';
import { onUpdateAlarmThresholdDataAction } from './actions/updateAlarmThresholdData';
import { convertAlarmsStateToAlarmDatas } from './converter/convertAlarmsStateToAlarmDatas';

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

  const onUpdateAlarmStateData = useCallback(
    (payload: UpdateAlarmStateDataActionPayload) => {
      dispatch(onUpdateAlarmStateDataAction(payload));
    },
    [dispatch]
  );

  const onUpdateAlarmThresholdData = useCallback(
    (payload: UpdateAlarmThresholdDataActionPayload) => {
      dispatch(onUpdateAlarmThresholdDataAction(payload));
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
    onUpdateAlarmStateData,
    onUpdateAlarmThresholdData,
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

export type OnUpdateAlarmStateDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmStateData'];

export type OnUpdateAlarmThresholdDataAction =
  UseAlarmsStateReturnValues['onUpdateAlarmThresholdData'];
