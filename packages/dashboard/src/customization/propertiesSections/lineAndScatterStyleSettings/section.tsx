import React from 'react';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import {
  ChartLegend,
  LineScatterChartWidget,
  LineStyles,
  SymbolStyles,
} from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { LineStyleSection } from './lineStyleSection';
import { YAxisSection } from './yAxis';
import { LegendSection } from './legendSection';
import { AggregationAndResolutionSection } from './aggregationAndResolutionSection';
import { isJust, maybeWithDefault } from '~/util/maybe';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import {
  getAggregationOptions,
  getResolutionOptions,
} from '../aggregationSettings/helpers';
import { useWidgetDataTypeSet } from '~/hooks/useWidgetDataTypeSet';
import { applyAggregationToQuery } from '~/customization/widgets/utils/assetQuery/applyAggregationToQuery';
import { applyResolutionToQuery } from '~/customization/widgets/utils/assetQuery/applyResolutionToQuery';
import { PropertyLens } from '~/customization/propertiesSection';
import { getPlugin } from '@iot-app-kit/core';

const isLineAndScatterWidget = (
  w: DashboardWidget
): w is LineScatterChartWidget => w.type === 'xy-plot';

const RenderLineAndScatterStyleSettingsSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<LineScatterChartWidget>;
}) => {
  const metricsRecorder = getPlugin('metricsRecorder');
  const logCustomYAxis = (contexts: Record<string, string> | undefined) => {
    metricsRecorder?.record({
      contexts,
      metricName: 'CustomYAxisChanged',
      metricValue: 1,
    });
  };

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
          ? applyAggregationToQuery(
              properties.queryConfig.query,
              updatedAggregationType
            )
          : undefined,
      },
      aggregationType: updatedAggregationType,
    })
  );

  const [resolutionMaybe, updateResolution] = useProperty(
    ({ resolution }) => resolution,
    (properties, updatedResolution) => {
      // We get the current aggregation and don't change it if it's already set.
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

  const [legendPositionMaybe, updateLegendPosition] = useProperty(
    (properties) => properties.legend?.position,
    (properties, updatedLegendPositon) => ({
      ...properties,
      legend: {
        ...properties.legend,
        position: updatedLegendPositon,
      },
    })
  );

  const connectionStyle = maybeWithDefault(undefined, connectionStyleMaybe);
  const lineStyle = maybeWithDefault(undefined, lineStyleMaybe);
  const lineThickness = maybeWithDefault(undefined, lineThicknessMaybe);
  const dataPointStyle = maybeWithDefault(undefined, dataPointStyleMaybe);
  const axis = maybeWithDefault(undefined, axisMaybe);
  const legendVisible = maybeWithDefault(undefined, legendVisibleMaybe);
  const legendPosition = maybeWithDefault(undefined, legendPositionMaybe);

  const aggregationType = maybeWithDefault(undefined, aggregationMaybe);
  const resolution = maybeWithDefault(undefined, resolutionMaybe);
  const assetQuery = maybeWithDefault(undefined, query);

  const dataTypeSet = useWidgetDataTypeSet(assetQuery ?? { assets: [] });
  const filteredResolutionOptions = getResolutionOptions(true);
  const filteredAggregationOptions = getAggregationOptions(
    true,
    dataTypeSet,
    resolution
  );

  const handleSetVisible = (visible: boolean) => {
    updateAxis({ ...axis, yVisible: visible });
    logCustomYAxis({
      visible: `${visible}`,
    });
  };

  const handleUpdateMin = (min: number | null) => {
    updateAxis({ ...axis, yMin: min ?? undefined });
    logCustomYAxis({
      min: `${min}`,
    });
  };

  const handleUpdateMax = (max: number | null) => {
    updateAxis({ ...axis, yMax: max ?? undefined });
    logCustomYAxis({
      max: `${max}`,
    });
  };

  const handleUpdateYLabel = (yLabel: string | null) => {
    updateAxis({ ...axis, yLabel: yLabel ?? undefined });
    logCustomYAxis({
      yLabel: `${yLabel}`,
    });
  };

  return (
    <>
      <AggregationAndResolutionSection
        aggregation={aggregationType}
        resolution={resolution}
        updateAggregation={(updatedAggregationType) =>
          updateAggregation(updatedAggregationType as AggregateType)
        }
        updateResolution={updateResolution}
        resolutionOptions={filteredResolutionOptions}
        aggregationOptions={filteredAggregationOptions}
      />
      <YAxisSection
        visible={axis?.yVisible ?? true}
        min={axis?.yMin ?? null}
        max={axis?.yMax ?? null}
        yLabel={axis?.yLabel ?? null}
        setVisible={handleSetVisible}
        updateMin={handleUpdateMin}
        updateMax={handleUpdateMax}
        updateYLabel={handleUpdateYLabel}
      />
      <LineStyleSection
        lineType={connectionStyle}
        lineStyle={lineStyle}
        lineThickness={lineThickness}
        dataPointStyle={dataPointStyle}
        updatelineStyle={(style) =>
          updateLineStyle(style as LineStyles['style'])
        }
        updateLineThickness={(thickness) => {
          updateLineThickness(thickness as LineStyles['thickness']);
        }}
        updateType={(type) =>
          updateConnectionStyle(type as LineStyles['connectionStyle'])
        }
        updateDataPointStyle={(dataPointStyle) =>
          updateDataPointStyle(dataPointStyle as SymbolStyles['style'])
        }
      />
      <LegendSection
        visible={legendVisible}
        position={legendPosition}
        setVisible={updateLegendVisible}
        setAlignment={(position) =>
          updateLegendPosition(position as ChartLegend['position'])
        }
      />
    </>
  );
};

export const LineAndScatterStyleSettingsSection: React.FC = () => (
  <PropertiesSection
    isVisible={isLineAndScatterWidget}
    render={({ useProperty }) => (
      <RenderLineAndScatterStyleSettingsSection useProperty={useProperty} />
    )}
  />
);
