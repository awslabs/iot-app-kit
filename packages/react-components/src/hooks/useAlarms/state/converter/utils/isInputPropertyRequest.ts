import { AlarmInputPropertyRequest, AlarmRequest } from '../../../types';
import { AlarmRequestState } from '../../types';

export const isInputPropertyRequest = (
  alarmStateRequest: AlarmRequestState<AlarmRequest>
): alarmStateRequest is AlarmRequestState<AlarmInputPropertyRequest> => {
  return alarmStateRequest.request.inputPropertyId != null;
};
