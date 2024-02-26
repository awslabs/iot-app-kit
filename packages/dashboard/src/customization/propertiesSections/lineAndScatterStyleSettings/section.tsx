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
import { maybeWithDefault } from '~/util/maybe';
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

  const [legendVisibleContentMaybe, updateLegendVisibleContent] = useProperty(
    (properties) => properties.legend?.visibleContent,
    (properties, updatedLegendVisibleContent) => ({
      ...properties,
      legend: {
        ...properties.legend,
        visibleContent: updatedLegendVisibleContent,
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
  const legendVisibleContent = maybeWithDefault(
    undefined,
    legendVisibleContentMaybe
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
        setVisibleContent={(visibleContent) => {
          updateLegendVisibleContent(
            visibleContent as ChartLegend['visibleContent']
          );
        }}
        visibleContent={legendVisibleContent}
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
