import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { isAnomalyEvent } from './isAnomalyEvent';
import { type AnomalyEvent } from './types';
import { parseDiagnostics } from './parseDiagnostics';
import { toTimestamp } from '@iot-app-kit/core';

export const parseAnomalyEvent = (
  assetPropertyValue: AssetPropertyValue
): AnomalyEvent | undefined => {
  const stringValue = assetPropertyValue.value?.stringValue;
  if (!stringValue) return;
  const parsedStringValue = JSON.parse(stringValue);
  const stringValueIsAnomalyEvent = isAnomalyEvent(parsedStringValue);
  if (!stringValueIsAnomalyEvent) return;
  return {
    ...parsedStringValue,
    timestamp: toTimestamp(assetPropertyValue.timestamp),
    diagnostics: parseDiagnostics(parsedStringValue.diagnostics),
  };
};
