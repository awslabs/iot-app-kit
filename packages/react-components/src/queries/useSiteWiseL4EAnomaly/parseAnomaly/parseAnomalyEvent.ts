import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { isAnomalyEvent } from './isAnomalyEvent';
import { AnomalyEvent } from './types';
import { parseDiagnostics } from './parseDiagnostics';

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
    diagnostics: parseDiagnostics(parsedStringValue.diagnostics),
  };
};
