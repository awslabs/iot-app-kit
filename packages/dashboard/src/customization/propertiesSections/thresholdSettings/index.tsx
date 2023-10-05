import React from 'react';
import { ThresholdSettings } from '@iot-app-kit/core';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { PropertyLens } from '~/customization/propertiesSection';
import { StyledThreshold, ThresholdWithId } from '~/customization/settings';
import { DashboardWidget } from '~/types';
import ThresholdsSection from './thresholdsSection';
import { getComparisonOperators } from './comparisonOperators';

const thresholdsWithContainsOperator: readonly string[] = ['kpi', 'status', 'table'];
const thresholdsWithAnnotations: readonly string[] = ['line-chart', 'scatter-chart', 'bar-chart', 'status-timeline'];
const thresholdsWithStyle: readonly string[] = ['xy-plot'];

type ThresholdsProperties = { thresholds?: ThresholdWithId[] };
type AnnotationsProperties = { thresholdSettings?: ThresholdSettings };
type StyledThresholdProperties = { thresholds?: (ThresholdWithId & StyledThreshold)[] };

export type ThresholdsWidget = DashboardWidget<ThresholdsProperties>;
type ThresholdsWithAnnotationsWidget = DashboardWidget<ThresholdsProperties & AnnotationsProperties>;
type ThresholdsWithStyleWidget = DashboardWidget<ThresholdsProperties & StyledThresholdProperties>;

const supportsAnnotations = (w: DashboardWidget): w is ThresholdsWithAnnotationsWidget =>
  thresholdsWithAnnotations.some((t) => t === w.type);
const supportsContainsOperator = (w: DashboardWidget): w is ThresholdsWidget =>
  thresholdsWithContainsOperator.some((t) => t === w.type);
const supportsStyledThreshold = (w: DashboardWidget): w is ThresholdsWithStyleWidget =>
  thresholdsWithStyle.some((t) => t === w.type);

// there is no widget type overlap between the 2 lists
const isThresholdWidgetSupportsContainsOperator = (w: DashboardWidget): w is ThresholdsWidget =>
  supportsContainsOperator(w);
const isThresholdWidgetSupportsAnnotations = (w: DashboardWidget): w is ThresholdsWithAnnotationsWidget =>
  supportsAnnotations(w);
const isStyledThresholdWidget = (w: DashboardWidget): w is ThresholdsWithStyleWidget => supportsStyledThreshold(w);

const RenderThresholdsSettingsWithContains = ({ useProperty }: { useProperty: PropertyLens<ThresholdsWidget> }) => {
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
};

const RenderThresholdsSettingsWithAnnotations = ({
  useProperty,
}: {
  useProperty: PropertyLens<ThresholdsWithAnnotationsWidget>;
}) => {
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
};

const RenderThresholdsSettingsWithStyledQuery = ({
  useProperty,
}: {
  useProperty: PropertyLens<ThresholdsWithStyleWidget>;
}) => {
  const [thresholds, updateThresholds] = useProperty(
    (properties) => properties.thresholds,
    (properties, updatedThresholds) => ({ ...properties, thresholds: updatedThresholds })
  );

  return (
    <ThresholdsSection
      comparisonOperators={getComparisonOperators({ supportsContains: false })}
      styledThresholds={thresholds}
      updateStyledThresholds={updateThresholds}
    />
  );
};

export const ThresholdSettingsConfiguration: React.FC = () => (
  <>
    <PropertiesSection
      isVisible={isThresholdWidgetSupportsContainsOperator}
      render={({ useProperty }) => <RenderThresholdsSettingsWithContains useProperty={useProperty} />}
    />
    <PropertiesSection
      isVisible={isThresholdWidgetSupportsAnnotations}
      render={({ useProperty }) => <RenderThresholdsSettingsWithAnnotations useProperty={useProperty} />}
    />
    <PropertiesSection
      isVisible={isStyledThresholdWidget}
      render={({ useProperty }) => <RenderThresholdsSettingsWithStyledQuery useProperty={useProperty} />}
    />
  </>
);
