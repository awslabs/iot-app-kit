import { AnomalyEventDiagnostic } from './types';

export const isDiagnostic = (
  diagnostic: object
): diagnostic is AnomalyEventDiagnostic => {
  const isCorrectShape = 'name' in diagnostic && 'value' in diagnostic;
  if (!isCorrectShape) return false;
  const isCorrectTypes =
    typeof diagnostic.name === 'string' && typeof diagnostic.value === 'number';
  if (!isCorrectTypes) return false;

  // the diagnostic name is in the shape of uuid\\uuid
  // uuid is the property id
  const nameIsParseable = (diagnostic.name as string).indexOf('\\') > 0;
  if (!nameIsParseable) return false;

  return true;
};

export const isDiagnostics = (
  diagnostics: unknown
): diagnostics is AnomalyEventDiagnostic[] =>
  Array.isArray(diagnostics) && diagnostics.every(isDiagnostic);
