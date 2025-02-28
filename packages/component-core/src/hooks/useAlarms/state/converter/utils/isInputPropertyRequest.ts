import {
  type AlarmInputPropertyRequest,
  type AlarmRequest,
} from '../../../types';
import { type AlarmRequestState } from '../../types';

export const isInputPropertyRequest = (
  alarmStateRequest: AlarmRequestState<AlarmRequest>
): alarmStateRequest is AlarmRequestState<AlarmInputPropertyRequest> => {
  return alarmStateRequest.request.inputPropertyId != null;
};
