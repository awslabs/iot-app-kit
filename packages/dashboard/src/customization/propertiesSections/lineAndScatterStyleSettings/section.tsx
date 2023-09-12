import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { LineScatterChartWidget, LineStyles, SymbolStyles } from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { TypeSection } from './typeSection';
import { TitleSection } from './titleSection';
import { LineStyleSection } from './lineStyleSection';
import { DataPointStyleSection } from './dataPointStyleSection';
import { YAxisSection } from './yAxis';
import { LegendSection } from './legendSection';
import { AggregationAndResolutionSection } from './aggregationAndResolutionSection';
import { maybeWithDefault } from '~/util/maybe';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { getAggregationOptions, getResolutionOptions } from '../aggregationSettings/helpers';
import { useWidgetDataTypeSet } from '~/hooks/useWidgetDataTypeSet';
import { applyAggregationToQuery } from '~/customization/widgets/utils/assetQuery/applyAggregationToQuery';
import { applyResolutionToQuery } from '~/customization/widgets/utils/assetQuery/applyResolutionToQuery';

const isLineAndScatterWidget = (w: DashboardWidget): w is LineScatterChartWidget => w.type === 'line-scatter-chart';

export const LineAndScatterStyleSettingsSection: React.FC = () => (
  <PropertiesSection
      isVisible={isLineAndScatterWidget}
      render={({ useProperty }) => {
        const [connectionStyleMaybe, updateConnectionStyle] = useProperty(
          properties => properties.line?.connectionStyle,
          (properties, updatedConnectionStyle) => ({
            ...properties,
            line: {
              ...properties.line,
              connectionStyle: updatedConnectionStyle,
            }
          })
        );

        const [titleMaybe, updateTitle] = useProperty(
          properties => properties.title,
          (properties, updatedTitle) => ({
            ...properties,
            title: updatedTitle,
          })
        );

        const [lineStyleMaybe, updateLineStyle] = useProperty(
          properties => properties.line?.style,
          (properties, updatedLineStyle) => ({
            ...properties,
            line: {
              ...properties.line,
              style: updatedLineStyle,
            }
          })
        );

        const [dataPointStyleMaybe, updateDataPointStyle] = useProperty(
          properties => properties.symbol?.style,
          (properties, updatedDataPointStyle) => ({
            ...properties,
            symbol: {
              ...properties.symbol,
              style: updatedDataPointStyle,
            }
          })
        );

        const [axisMaybe, updateAxis] = useProperty(
          properties => properties.axis,
          (properties, updatedAxis) => ({
            ...properties,
            axis: updatedAxis
          })
        );

        const [query, updateQuery] = useProperty(
          properties => properties.queryConfig.query,
          (properties, updatedQuery) => ({
            ...properties,
            queryConfig: {
              ...properties.queryConfig,
              query: updatedQuery,
            }
          })
        );
        const [aggregationMaybe, updateAggregation] = useProperty(
          properties => properties.aggregationType,
          (properties, updatedAggregationType) => ({
            ...properties,
            aggregationType: updatedAggregationType
          })
        );
        const [resolutionMaybe, updateResolution] = useProperty(
          properties => properties.resolution,
          (properties, updatedResolution) => ({
            ...properties,
            resolution: updatedResolution
          })
        );

        const [legendVisibleMaybe, updateLegendVisible] = useProperty(
          properties => properties.legend?.visible,
          (properties, updatedLegendVisible) => ({
            ...properties,
            legend: {
              ...properties.legend,
              visible: updatedLegendVisible
            }
          })
        );

        const connectionStyle = maybeWithDefault(undefined, connectionStyleMaybe);
        const title = maybeWithDefault(undefined, titleMaybe);
        const lineStyle = maybeWithDefault(undefined, lineStyleMaybe);
        const dataPointStyle = maybeWithDefault(undefined, dataPointStyleMaybe);
        const axis = maybeWithDefault(undefined, axisMaybe);
        const legendVisible = maybeWithDefault(true, legendVisibleMaybe) ?? true;

        const aggregationType = maybeWithDefault(undefined, aggregationMaybe);
        const resolution = maybeWithDefault(undefined, resolutionMaybe);
        const assetQuery = maybeWithDefault(undefined, query);

        const dataTypeSet = useWidgetDataTypeSet(assetQuery ?? { assets: [] });
        const filteredResolutionOptions = getResolutionOptions(true);
        const filteredAggregationOptions = getAggregationOptions(true, dataTypeSet, resolution);

        const onUpdateAggregation = (updatedAggregationType: AggregateType) => {
          updateAggregation(updatedAggregationType);
          if (assetQuery) {
            updateQuery(applyAggregationToQuery(assetQuery, updatedAggregationType));
          }
        };
        const onUpdateResolution = (updatedResolution: string) => {
          updateResolution(updatedResolution);
          if (assetQuery) {
            updateQuery(applyResolutionToQuery(assetQuery, updatedResolution));
          }
        };

        return (
          <>
            <TypeSection type={connectionStyle} updateType={(type) => updateConnectionStyle(type as LineStyles['connectionStyle'])} />
            <TitleSection title={title} updateTitle={updateTitle} />
            <LineStyleSection lineStyle={lineStyle} updatelineStyle={(style) => updateLineStyle(style as LineStyles['style'])} />
            <DataPointStyleSection dataPointStyle={dataPointStyle} updateDataPointStyle={(dataPointStyle) => updateDataPointStyle(dataPointStyle as SymbolStyles['style'])} />
            <YAxisSection visible={axis?.yVisible ?? true} min={axis?.yMin ?? null} max={axis?.yMax ?? null} setVisible={(visible) => updateAxis({...axis, yVisible: visible})} updateMin={(min) => updateAxis({ ...axis, yMin: min ?? undefined})} updateMax={(max) => updateAxis({...axis, yMax: max ?? undefined})} />
            <AggregationAndResolutionSection aggregation={aggregationType} resolution={resolution} updateAggregation={(updatedAggregationType) => onUpdateAggregation(updatedAggregationType as AggregateType)} updateResolution={onUpdateResolution} resolutionOptions={filteredResolutionOptions} aggregationOptions={filteredAggregationOptions} />
            <LegendSection visible={legendVisible} setVisible={updateLegendVisible} />
          </>
        );
      }}
    />
);
