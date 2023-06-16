import type { SuccessValue, SkippedValue, ErrorValue } from './types';

export function isSuccessValue(latestValue: SuccessValue | SkippedValue | ErrorValue): latestValue is SuccessValue {
  return latestValue != null && 'value' in latestValue;
}

export function isSkippedValue(latestValue: SuccessValue | SkippedValue | ErrorValue): latestValue is SkippedValue {
  return latestValue != null && 'completionStatus' in latestValue;
}

export function isErrorValue(latestValue: SuccessValue | SkippedValue | ErrorValue): latestValue is ErrorValue {
  return latestValue != null && 'errorMessage' in latestValue;
}
