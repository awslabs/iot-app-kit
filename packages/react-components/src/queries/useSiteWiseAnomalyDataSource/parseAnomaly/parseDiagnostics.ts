import { type AnomalyEventDiagnostic } from './types';

const parseDiagnostic = (diagnostic: AnomalyEventDiagnostic) => {
  const { name, value } = diagnostic;
  // the shape of the name is propertyId\\propertyId
  const id = name.split('\\').at(0) ?? '';
  return {
    name: id,
    value,
  };
};

export const parseDiagnostics = (diagnostics: AnomalyEventDiagnostic[]) =>
  diagnostics.map(parseDiagnostic);
