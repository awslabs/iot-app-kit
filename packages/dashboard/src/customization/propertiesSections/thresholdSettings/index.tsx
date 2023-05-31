import React from 'react';
import { ThresholdSettings } from '@iot-app-kit/core';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { ThresholdWithId } from '~/customization/settings';
import { DashboardWidget } from '~/types';
import ThresholdsSection from './thresholdsSection';
import { getComparisonOperators } from './comparisonOperators';

const thresholdsWithContainsOperator: readonly string[] = ['kpi', 'status', 'table'];
const thresholdsWithAnnotations: readonly string[] = ['line-chart', 'scatter-chart', 'bar-chart', 'status-timeline'];

type ThresholdsProperties = { thresholds?: ThresholdWithId[] };
type AnnotationsProperties = { thresholdSettings?: ThresholdSettings };

export type ThresholdsWidget = DashboardWidget<ThresholdsProperties>;
type ThresholdsWithAnnotationsWidget = DashboardWidget<ThresholdsProperties & AnnotationsProperties>;

const supportsAnnotations = (w: DashboardWidget): w is ThresholdsWithAnnotationsWidget =>
  thresholdsWithAnnotations.some((t) => t === w.type);
const supportsContainsOperator = (w: DashboardWidget): w is ThresholdsWidget =>
  thresholdsWithContainsOperator.some((t) => t === w.type);

// there is no widget type overlap between the 2 lists
const isThresholdWidgetSupportsContainsOperator = (w: DashboardWidget): w is ThresholdsWidget =>
  supportsContainsOperator(w);
const isThresholdWidgetSupportsAnnotations = (w: DashboardWidget): w is ThresholdsWithAnnotationsWidget =>
  supportsAnnotations(w);

export const ThresholdSettingsConfiguration: React.FC = () => (
  <>
    <PropertiesSection
      isVisible={isThresholdWidgetSupportsContainsOperator}
      render={({ useProperty }) => {
        const [thresholds, updateThresholds] = useProperty(
          (properties) => properties.thresholds,
          (properties, updatedThresholds) => ({ ...properties, thresholds: updatedThresholds })
        );

        return (
          <ThresholdsSection
            thresholds={thresholds}
            updateThresholds={updateThresholds}
            comparisonOperators={getComparisonOperators({ supportsContains: true })}
          />
        );
      }}
    />
    <PropertiesSection
      isVisible={isThresholdWidgetSupportsAnnotations}
      render={({ useProperty }) => {
        const [thresholds, updateThresholds] = useProperty(
          (properties) => properties.thresholds,
          (properties, updatedThresholds) => ({ ...properties, thresholds: updatedThresholds })
        );
        const [thresholdSettings, updateThresholdSettings] = useProperty(
          (properties) => properties.thresholdSettings,
          (properties, updatedThresholdSettings) => ({ ...properties, thresholdSettings: updatedThresholdSettings })
        );

        return (
          <ThresholdsSection
            thresholds={thresholds}
            updateThresholds={updateThresholds}
            comparisonOperators={getComparisonOperators({ supportsContains: false })}
            thresholdSettings={thresholdSettings}
            updateThresholdSettings={updateThresholdSettings}
          />
        );
      }}
    />
  </>
);
