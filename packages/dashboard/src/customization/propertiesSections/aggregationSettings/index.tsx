import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { type SelectProps } from '@cloudscape-design/components/select';
import React from 'react';

import { AggregationAndResolutionSection } from '../lineAndScatterStyleSettings/aggregationAndResolutionSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { LineScatterChartWidget } from '~/customization/widgets/types';
import { applyAggregationToQuery } from '~/customization/widgets/utils/assetQuery/applyAggregationToQuery';
import { applyResolutionToQuery } from '~/customization/widgets/utils/assetQuery/applyResolutionToQuery';
import { type FilterPredicate, PropertyLens } from '~/customization/propertiesSection';
import { type DashboardWidget } from '~/types';

import { isJust, maybeWithDefault } from '~/util/maybe';
const isOnlyRawData: readonly string[] = ['status-timeline', 'table', 'kpi', 'status'];
const isOnlyAggregated: readonly string[] = ['bar-chart'];

export const RESOLUTION_OPTIONS: SelectProps.Option[] = [
  { label: '1 min', value: '1m' },
  { label: '15 min', value: '15m' },
  { label: '1 hour', value: '1h' },
  { label: '1 day', value: '1d' },
  { label: 'Autoselect', value: undefined },
];

export const AGGREGATION_OPTIONS: SelectProps.Option[] = [
  { label: 'Average', value: AggregateType.AVERAGE },
  { label: 'Count', value: AggregateType.COUNT },
  { label: 'Maximum', value: AggregateType.MAXIMUM },
  { label: 'Minimum', value: AggregateType.MINIMUM },
  { label: 'Standard deviation', value: AggregateType.STANDARD_DEVIATION },
  { label: 'Sum', value: AggregateType.SUM },
];

// TODO: Fix lying type
export const isOnlyRawDataWidget = (widget: DashboardWidget): widget is LineScatterChartWidget =>
  isOnlyRawData.some((t) => t === widget.type);

// TODO: Fix lying type
export const isOnlyAggregatedDataWidget = (widget: DashboardWidget): widget is LineScatterChartWidget =>
  isOnlyAggregated.some((t) => t === widget.type);

const RenderAggregationsPropertiesSection = ({
  useProperty,
}: {
  // TODO: Fix lying type
  useProperty: PropertyLens<LineScatterChartWidget>;
}) => {
  const [aggregationMaybe, updateAggregation] = useProperty(
    // Default resolution is auto. We ensure the aggregation is defaulted to average instead of raw.
    ({ aggregationType }) => aggregationType,
    (properties, updatedAggregationType) => {
      return {
        ...properties,
        queryConfig: {
          ...properties.queryConfig,
          query: properties.queryConfig.query
            ? applyAggregationToQuery(properties.queryConfig.query, updatedAggregationType)
            : undefined,
        },
        aggregationType: updatedAggregationType,
      };
    }
  );
  const [resolutionMaybe, updateResolution] = useProperty(
    ({ resolution }) => resolution,
    (properties, updatedResolution) => {
      // We get the current aggregation and don't change it if it's already set.
      let updatedAggregationType: AggregateType | undefined = isJust(aggregationMaybe)
        ? aggregationMaybe.value
        : 'AVERAGE';

      // If auto resolution is set, we default to average aggregation.
      if (updatedResolution == null) {
        updatedAggregationType = 'AVERAGE';
      }

      const updatedQuery = properties.queryConfig.query
        ? applyResolutionToQuery(
            applyResolutionToQuery(properties.queryConfig.query, updatedAggregationType),
            updatedResolution
          )
        : undefined;

      return {
        ...properties,
        queryConfig: {
          ...properties.queryConfig,
          query: updatedQuery,
        },
        resolution: updatedResolution,
        aggregationType: updatedAggregationType,
      };
    }
  );

  const aggregationType = maybeWithDefault(undefined, aggregationMaybe);
  const resolution = maybeWithDefault(undefined, resolutionMaybe);

  return (
    <AggregationAndResolutionSection
      aggregation={aggregationType}
      resolution={resolution}
      updateAggregation={(updatedAggregationType) => updateAggregation(updatedAggregationType as AggregateType)}
      updateResolution={updateResolution}
      resolutionOptions={RESOLUTION_OPTIONS}
      aggregationOptions={AGGREGATION_OPTIONS}
    />
  );
};

const AggregationsPropertiesSection = ({
  isVisible,
  supportedData,
}: {
  // TODO: Fix lying type
  isVisible: FilterPredicate<LineScatterChartWidget>;
  supportedData: 'raw' | 'aggregated';
}) => {
  if (supportedData === 'raw') {
    return null;
  }

  return (
    <PropertiesSection
      isVisible={isVisible}
      render={({ useProperty }) => <RenderAggregationsPropertiesSection useProperty={useProperty} />}
    />
  );
};

export const AggregationsSettingsConfiguration: React.FC = () => (
  <>
    <AggregationsPropertiesSection isVisible={isOnlyRawDataWidget} supportedData='raw' />
    <AggregationsPropertiesSection isVisible={isOnlyAggregatedDataWidget} supportedData='aggregated' />
  </>
);
