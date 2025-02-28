import { type AnomalyEvent } from './types';

export const extractDiagnoticProperties = (anomalyEvents: AnomalyEvent[]) => {
  const diagnosticPropertyMap = new Map<string, string>();
  anomalyEvents.forEach(({ diagnostics }) => {
    diagnostics.forEach(({ name }) => {
      diagnosticPropertyMap.set(name, name);
    });
  });

  return [...diagnosticPropertyMap.keys()];
};
