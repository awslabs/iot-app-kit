import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { LineScatterChartWidget, LineStyles, SymbolStyles } from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { TitleSection } from './titleSection';
import { LineStyleSection } from './lineStyleSection';
import { YAxisSection } from './yAxis';
import { LegendSection } from './legendSection';
import { AggregationAndResolutionSection } from './aggregationAndResolutionSection';
import { isJust, maybeWithDefault } from '~/util/maybe';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { getAggregationOptions, getResolutionOptions } from '../aggregationSettings/helpers';
import { useWidgetDataTypeSet } from '~/hooks/useWidgetDataTypeSet';
import { applyAggregationToQuery } from '~/customization/widgets/utils/assetQuery/applyAggregationToQuery';
import { applyResolutionToQuery } from '~/customization/widgets/utils/assetQuery/applyResolutionToQuery';
import { PropertyLens } from '~/customization/propertiesSection';

const isLineAndScatterWidget = (w: DashboardWidget): w is LineScatterChartWidget => w.type === 'xy-plot';

const RenderLineAndScatterStyleSettingsSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<LineScatterChartWidget>;
}) => {
  const [connectionStyleMaybe, updateConnectionStyle] = useProperty(
    (properties) => properties.line?.connectionStyle,
    (properties, updatedConnectionStyle) => ({
      ...properties,
      line: {
        ...properties.line,
        connectionStyle: updatedConnectionStyle,
      },
    })
  );

  const [titleMaybe, updateTitle] = useProperty(
    (properties) => properties.title,
    (properties, updatedTitle) => ({
      ...properties,
      title: updatedTitle,
    })
  );

  const [lineStyleMaybe, updateLineStyle] = useProperty(
    (properties) => properties.line?.style,
    (properties, updatedLineStyle) => ({
      ...properties,
      line: {
        ...properties.line,
        style: updatedLineStyle,
      },
    })
  );

  const [lineThicknessMaybe, updateLineThickness] = useProperty(
    (properties) => properties.line?.thickness,
    (properties, updatedLineThickness) => ({
      ...properties,
      line: {
        ...properties.line,
        thickness: updatedLineThickness,
      },
    })
  );

  const [dataPointStyleMaybe, updateDataPointStyle] = useProperty(
    (properties) => properties.symbol?.style,
    (properties, updatedDataPointStyle) => ({
      ...properties,
      symbol: {
        ...properties.symbol,
        style: updatedDataPointStyle,
      },
    })
  );

  const [axisMaybe, updateAxis] = useProperty(
    (properties) => properties.axis,
    (properties, updatedAxis) => ({
      ...properties,
      axis: updatedAxis,
    })
  );

  const [query] = useProperty(
    (properties) => properties.queryConfig.query,
    (properties, updatedQuery) => ({
      ...properties,
      queryConfig: {
        ...properties.queryConfig,
        query: updatedQuery,
      },
    })
  );

  const [aggregationMaybe, updateAggregation] = useProperty(
    // Default resolution is auto. We ensure the aggregation is defaulted to average instead of no aggregation.
    ({ aggregationType }) => aggregationType,
    (properties, updatedAggregationType) => ({
      ...properties,
      queryConfig: {
        ...properties.queryConfig,
        query: properties.queryConfig.query
          ? applyAggregationToQuery(properties.queryConfig.query, updatedAggregationType)
          : undefined,
      },
      aggregationType: updatedAggregationType,
    })
  );

  const [resolutionMaybe, updateResolution] = useProperty(
    ({ resolution }) => resolution,
    (properties, updatedResolution) => {
      // We get the current aggregation and don't change it if it's already set.
      let updatedAggregationType: AggregateType | undefined = isJust(aggregationMaybe)
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

  const [legendVisibleMaybe, updateLegendVisible] = useProperty(
    (properties) => properties.legend?.visible,
    (properties, updatedLegendVisible) => ({
      ...properties,
      legend: {
        ...properties.legend,
        visible: updatedLegendVisible,
      },
    })
  );

  const connectionStyle = maybeWithDefault(undefined, connectionStyleMaybe);
  const title = maybeWithDefault(undefined, titleMaybe);
  const lineStyle = maybeWithDefault(undefined, lineStyleMaybe);
  const lineThickness = maybeWithDefault(undefined, lineThicknessMaybe);
  const dataPointStyle = maybeWithDefault(undefined, dataPointStyleMaybe);
  const axis = maybeWithDefault(undefined, axisMaybe);
  const legendVisible = maybeWithDefault(true, legendVisibleMaybe) ?? true;

  const aggregationType = maybeWithDefault(undefined, aggregationMaybe);
  const resolution = maybeWithDefault(undefined, resolutionMaybe);
  const assetQuery = maybeWithDefault(undefined, query);

  const dataTypeSet = useWidgetDataTypeSet(assetQuery ?? { assets: [] });
  const filteredResolutionOptions = getResolutionOptions(true);
  const filteredAggregationOptions = getAggregationOptions(true, dataTypeSet, resolution);

  return (
    <SpaceBetween size='s' direction='vertical'>
      <TitleSection title={title} updateTitle={updateTitle} />
      <AggregationAndResolutionSection
        aggregation={aggregationType}
        resolution={resolution}
        updateAggregation={(updatedAggregationType) => updateAggregation(updatedAggregationType as AggregateType)}
        updateResolution={updateResolution}
        resolutionOptions={filteredResolutionOptions}
        aggregationOptions={filteredAggregationOptions}
      />
      <YAxisSection
        visible={axis?.yVisible ?? true}
        min={axis?.yMin ?? null}
        max={axis?.yMax ?? null}
        setVisible={(visible) => updateAxis({ ...axis, yVisible: visible })}
        updateMin={(min) => updateAxis({ ...axis, yMin: min ?? undefined })}
        updateMax={(max) => updateAxis({ ...axis, yMax: max ?? undefined })}
      />
      <LineStyleSection
        lineType={connectionStyle}
        lineStyle={lineStyle}
        lineThickness={lineThickness}
        dataPointStyle={dataPointStyle}
        updatelineStyle={(style) => updateLineStyle(style as LineStyles['style'])}
        updateLineThickness={(thickness) => {
          updateLineThickness(thickness as LineStyles['thickness']);
        }}
        updateType={(type) => updateConnectionStyle(type as LineStyles['connectionStyle'])}
        updateDataPointStyle={(dataPointStyle) => updateDataPointStyle(dataPointStyle as SymbolStyles['style'])}
      />
      <LegendSection visible={legendVisible} setVisible={updateLegendVisible} />
    </SpaceBetween>
  );
};

export const LineAndScatterStyleSettingsSection: React.FC = () => (
  <PropertiesSection
    isVisible={isLineAndScatterWidget}
    render={({ useProperty }) => <RenderLineAndScatterStyleSettingsSection useProperty={useProperty} />}
  />
);
