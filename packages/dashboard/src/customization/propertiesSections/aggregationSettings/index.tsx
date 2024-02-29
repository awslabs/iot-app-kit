import { AggregateType } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { AggregationAndResolutionSection } from '../lineAndScatterStyleSettings/aggregationAndResolutionSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { LineScatterChartWidget } from '~/customization/widgets/types';
import { applyAggregationToQuery } from '~/customization/widgets/utils/assetQuery/applyAggregationToQuery';
import { applyResolutionToQuery } from '~/customization/widgets/utils/assetQuery/applyResolutionToQuery';
import {
  type FilterPredicate,
  PropertyLens,
} from '~/customization/propertiesSection';
import { type DashboardWidget } from '~/types';

import { isJust, maybeWithDefault } from '~/util/maybe';
import {
  AGGREGATE_ONLY_AGGREGATION_OPTIONS,
  AGGREGATE_ONLY_RESOLUTION_OPTIONS,
  ALL_AGGREGATION_OPTIONS,
  ALL_RESOLUTION_OPTIONS,
} from '../constants';
import { SelectProps } from '@cloudscape-design/components';

const isOnlyRawData: readonly string[] = ['status-timeline', 'table'];
const isOnlyAggregated: readonly string[] = ['bar-chart'];
const isRawAndAggregated: readonly string[] = ['xy-plot', 'kpi', 'status'];

// TODO: Fix lying type
export const isOnlyRawDataWidget = (
  widget: DashboardWidget
): widget is LineScatterChartWidget =>
  isOnlyRawData.some((t) => t === widget.type);

// TODO: Fix lying type
export const isOnlyAggregatedDataWidget = (
  widget: DashboardWidget
): widget is LineScatterChartWidget =>
  isOnlyAggregated.some((t) => t === widget.type);

export const isAggregateAndRawDataWidget = (
  widget: DashboardWidget
): widget is LineScatterChartWidget =>
  isRawAndAggregated.some((t) => t === widget.type);

const RenderAggregationsPropertiesSection = ({
  useProperty,
  aggregationOptions,
  resolutionOptions,
}: {
  // TODO: Fix lying type
  useProperty: PropertyLens<LineScatterChartWidget>;
  aggregationOptions: SelectProps.Option[];
  resolutionOptions: SelectProps.Option[];
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
            ? applyAggregationToQuery(
                properties.queryConfig.query,
                updatedAggregationType
              )
            : undefined,
        },
        aggregationType: updatedAggregationType,
      };
    }
  );
  const [resolutionMaybe, updateResolution] = useProperty(
    ({ resolution }) => resolution,
    (properties, updatedResolution) => {
      let updatedAggregationType: AggregateType | undefined = isJust(
        aggregationMaybe
      )
        ? aggregationMaybe.value
        : undefined;

      // If auto resolution is set, we default to no aggregation.
      if (updatedResolution == null) {
        updatedAggregationType = 'AVERAGE';
      }

      // If a non-auto resolution is set and there is no selected aggregation type, we default to average aggregation.
      if (updatedResolution != null && updatedAggregationType == null) {
        updatedAggregationType = 'AVERAGE';
      }

      // If the resolution is raw, we don't need an aggregation.
      if (updatedResolution === '0') {
        updatedAggregationType = undefined;
      }

      const updatedQuery = properties.queryConfig.query
        ? applyResolutionToQuery(
            applyResolutionToQuery(
              properties.queryConfig.query,
              updatedAggregationType
            ),
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
      updateAggregation={(updatedAggregationType) =>
        updateAggregation(updatedAggregationType as AggregateType)
      }
      updateResolution={updateResolution}
      resolutionOptions={resolutionOptions}
      aggregationOptions={aggregationOptions}
    />
  );
};

const AggregationsPropertiesSection = ({
  isVisible,
  supportedData,
}: {
  // TODO: Fix lying type
  isVisible: FilterPredicate<LineScatterChartWidget>;
  supportedData: 'raw' | 'aggregated' | 'all';
}) => {
  if (supportedData === 'raw') {
    return null;
  }

  return (
    <PropertiesSection
      isVisible={isVisible}
      render={({ useProperty }) => (
        <RenderAggregationsPropertiesSection
          aggregationOptions={
            supportedData === 'all'
              ? ALL_AGGREGATION_OPTIONS
              : AGGREGATE_ONLY_AGGREGATION_OPTIONS
          }
          resolutionOptions={
            supportedData === 'all'
              ? ALL_RESOLUTION_OPTIONS
              : AGGREGATE_ONLY_RESOLUTION_OPTIONS
          }
          useProperty={useProperty}
        />
      )}
    />
  );
};

export const AggregationsSettingsConfiguration: React.FC = () => (
  <>
    <AggregationsPropertiesSection
      isVisible={isOnlyRawDataWidget}
      supportedData='raw'
    />
    <AggregationsPropertiesSection
      isVisible={isOnlyAggregatedDataWidget}
      supportedData='aggregated'
    />
    <AggregationsPropertiesSection
      isVisible={isAggregateAndRawDataWidget}
      supportedData='all'
    />
  </>
);
