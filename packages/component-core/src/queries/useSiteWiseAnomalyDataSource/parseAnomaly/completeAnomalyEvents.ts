import { type DescribeAssetPropertyCommandOutput } from '@aws-sdk/client-iotsitewise';
import { type AnomalyEvent } from './types';

export const completeAnomalyEvents = (
  anomalyEvents: AnomalyEvent[],
  propertyDescriptions: DescribeAssetPropertyCommandOutput[]
) => {
  return anomalyEvents.map(({ diagnostics, ...anomalyEventProperties }) => {
    const completedDiagnostics = diagnostics.map(
      ({ name, ...diagnosticProperties }) => {
        const propertyName = propertyDescriptions.find(
          (d) => d.assetProperty?.id === name
        )?.assetProperty?.name;

        return {
          ...diagnosticProperties,
          name: propertyName ?? name,
        };
      }
    );
    return {
      ...anomalyEventProperties,
      diagnostics: completedDiagnostics,
    };
  });
};
