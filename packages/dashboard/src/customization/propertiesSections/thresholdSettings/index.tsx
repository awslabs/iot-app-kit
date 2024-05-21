import React from 'react';
import { StyledThreshold, ThresholdSettings } from '@iot-app-kit/core';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { PropertyLens } from '~/customization/propertiesSection';
import { ThresholdWithId } from '~/customization/settings';
import { DashboardWidget } from '~/types';
import ThresholdsSection from './thresholdsSection';
import { getComparisonOperators } from './comparisonOperators';
import { Maybe, maybeWithDefault } from '~/util/maybe';

const thresholdsWithContainsOperator: readonly string[] = [
  'kpi',
  'gauge',
  'status',
  'status-timeline',
  'table',
];
const thresholdsWithAnnotations: readonly string[] = [
  'line-chart',
  'scatter-chart',
  'bar-chart',
  'status-timeline',
];
const thresholdsWithStyle: readonly string[] = ['xy-plot', 'kpi', 'status'];

// Type encompassing all possible properties for a widget's thresholds
type ThresholdProperties = {
  thresholds?: (ThresholdWithId & StyledThreshold)[];
  thresholdSettings?: ThresholdSettings;
};

export type ThresholdsWidget = DashboardWidget<ThresholdProperties>;
const isSupportedWidget = (w: DashboardWidget): w is ThresholdsWidget => {
  const allSupportedThresholds = [
    ...thresholdsWithAnnotations,
    ...thresholdsWithContainsOperator,
    ...thresholdsWithStyle,
  ];
  return allSupportedThresholds.some((t) => t === w.type);
};

const RenderThresholdsSettings = ({
  type,
  types,
  useProperty,
}: {
  type: Maybe<string>;
  types: string[];
  useProperty: PropertyLens<ThresholdsWidget>;
}) => {
  const widgetType = maybeWithDefault('', type);

  let doesSupportAnnotations;
  let doesSupportContainsOp;
  let doesSupportStyledThreshold;

  // Support setting thresholds for multiple widgets at once if they fall in the same type category
  if (widgetType === '' && types.length > 1) {
    doesSupportAnnotations = types.every((v) =>
      thresholdsWithAnnotations.includes(v)
    );
    doesSupportContainsOp = types.every((v) =>
      thresholdsWithContainsOperator.includes(v)
    );
    doesSupportStyledThreshold = types.every((v) =>
      thresholdsWithStyle.includes(v)
    );
  } else {
    doesSupportAnnotations = thresholdsWithAnnotations.some(
      (t) => t === widgetType
    );
    doesSupportContainsOp = thresholdsWithContainsOperator.some(
      (t) => t === widgetType
    );
    doesSupportStyledThreshold = thresholdsWithStyle.some(
      (t) => t === widgetType
    );
  }

  const [thresholds, updateThresholds] = useProperty(
    (properties) => properties.thresholds,
    (properties, updatedThresholds) => ({
      ...properties,
      thresholds: updatedThresholds,
    })
  );
  const [thresholdSettings, updateThresholdSettings] = useProperty(
    (properties) => properties.thresholdSettings,
    (properties, updatedThresholdSettings) => ({
      ...properties,
      thresholdSettings: updatedThresholdSettings,
    })
  );

  let props = {};
  if (doesSupportContainsOp) {
    props = {
      thresholds: thresholds,
      updateThresholds: updateThresholds,
    };
  }
  if (doesSupportAnnotations) {
    props = {
      thresholds: thresholds,
      updateThresholds: updateThresholds,
      thresholdSettings: thresholdSettings,
      updateThresholdSettings: updateThresholdSettings,
    };
  } else if (doesSupportStyledThreshold) {
    props = {
      styledThresholds: thresholds,
      updateStyledThresholds: updateThresholds,
    };
  }

  return (
    <ThresholdsSection
      widgetType={widgetType}
      comparisonOperators={getComparisonOperators({
        supportsContains: doesSupportContainsOp,
      })}
      {...props}
    />
  );
};

export const ThresholdSettingsConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isSupportedWidget}
    render={({ type, types, useProperty }) => (
      <RenderThresholdsSettings
        type={type}
        types={types}
        useProperty={useProperty}
      />
    )}
  />
);
