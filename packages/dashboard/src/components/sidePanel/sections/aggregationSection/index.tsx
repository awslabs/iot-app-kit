import React from 'react';
import type { FC } from 'react';
import { SelectProps, ExpandableSection, Box, Select } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { useWidgetLense } from '../../utils/useWidgetLense';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import type { QueryWidget } from '~/customization/widgets/types';
import { AssetPropertyQuery, AssetQuery } from '@iot-app-kit/source-iotsitewise/dist/es/time-series-data/types';
import type { DashboardWidget } from '~/types';
import { getResolutionOptions, getAggregationOptions } from './helpers';
import { useWidgetDataTypeSet } from '~/hooks/useWidgetDataTypeSet';

import './index.css';

const WidgetsWithAggregation = [
  'line-chart',
  'scatter-chart',
  'bar-chart',
  'status-timeline',
  'table',
  'kpi',
  'status',
];

export const isAggregationSupported = (widget: DashboardWidget): widget is QueryWidget =>
  WidgetsWithAggregation.some((t) => t === widget.type);

const defaultMessages = {
  header: 'Aggregations and resolution',
  resolutionLabel: 'Resolution',
  aggregationMessage: 'Aggregation',
};

const getAggregationSectionOptions = (siteWiseAssetQuery: SiteWiseAssetQuery | undefined, widget: QueryWidget) => {
  const { aggregationType, resolution } = siteWiseAssetQuery?.assets[0]?.properties[0] ?? {};

  const dataTypeSet = useWidgetDataTypeSet(siteWiseAssetQuery);
  const filteredResolutionOptions = getResolutionOptions(widget.type);
  const filteredAggregationOptions = getAggregationOptions(widget.type, dataTypeSet, resolution);

  const selectedAggregation =
    filteredAggregationOptions.find(({ value }) => value === aggregationType) || filteredAggregationOptions[0];

  const selectedResolution =
    filteredResolutionOptions.find(({ value }) => value === resolution) || filteredResolutionOptions[0];

  return {
    filteredResolutionOptions,
    filteredAggregationOptions,
    selectedAggregation,
    selectedResolution,
  };
};

const AggregationSettings: FC<QueryWidget> = (widget) => {
  const [siteWiseAssetQuery, updateSiteWiseAssetQuery] = useWidgetLense<QueryWidget, SiteWiseAssetQuery | undefined>(
    widget,
    (w) => w.properties.queryConfig.query,
    (w, query) => ({
      ...w,
      properties: {
        ...w.properties,
        queryConfig: {
          ...w.properties.queryConfig,
          query,
        },
      },
    })
  );

  const { filteredResolutionOptions, filteredAggregationOptions, selectedAggregation, selectedResolution } =
    getAggregationSectionOptions(siteWiseAssetQuery, widget);

  // given a resolution, determine what the new aggregation should be
  const getUpdatedAggregation = (resolution?: string) => {
    // resolution is raw
    if (resolution === '0') return undefined;
    // bar chart cannot represent raw data so an aggregation must always be present
    if (!resolution && widget.type !== 'bar-chart') return undefined;
    if (!selectedAggregation.value) return filteredAggregationOptions[0].value;
    return selectedAggregation.value; // else keep existing aggregation
  };

  // given an aggregation, determine what the new resolution should be
  const getUpdatedResolution = (_aggregation?: string) => {
    if (selectedResolution.value === '0') return filteredResolutionOptions[0].value;
    return selectedResolution.value;
  };

  const onUpdateResolutions: SelectProps['onChange'] = ({ detail }) => {
    if (!siteWiseAssetQuery) return;

    const newResolution = detail.selectedOption.value;
    const newAggregation = getUpdatedAggregation(newResolution);

    // new assets with updated resolution and aggregation
    const newAssets = {
      assets: siteWiseAssetQuery.assets.map((asset: AssetQuery) => ({
        ...asset,
        properties: asset.properties.map((assetProp: AssetPropertyQuery) => ({
          ...assetProp,
          resolution: detail.selectedOption.value,
          aggregationType: newAggregation as AggregateType,
        })),
      })),
    };

    updateSiteWiseAssetQuery(newAssets);
  };

  const onUpdateAggregation: SelectProps['onChange'] = ({ detail }) => {
    if (!siteWiseAssetQuery) return;

    const newAggregation = detail.selectedOption.value as AggregateType;
    const newResolution = getUpdatedResolution(newAggregation);

    // new assets with updated resolution and aggregation
    const newAssets = {
      assets: siteWiseAssetQuery.assets.map((asset: AssetQuery) => ({
        ...asset,
        properties: asset.properties.map((assetProp: AssetPropertyQuery) => ({
          ...assetProp,
          resolution: newResolution,
          aggregationType: newAggregation,
        })),
      })),
    };

    updateSiteWiseAssetQuery(newAssets);
  };

  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader>{defaultMessages.header}</ExpandableSectionHeader>}
      defaultExpanded
    >
      <div className='aggregation-settings-grid'>
        <Box variant='span'>{defaultMessages.resolutionLabel}</Box>
        <Select
          options={filteredResolutionOptions}
          selectedOption={selectedResolution}
          onChange={onUpdateResolutions}
          data-test-id='aggregation-section-resolution-select'
        />
        <Box variant='span'>{defaultMessages.aggregationMessage}</Box>
        <Select
          options={filteredAggregationOptions}
          selectedOption={selectedAggregation}
          onChange={onUpdateAggregation}
          data-test-id='aggregation-section-aggregation-select'
        />
      </div>
    </ExpandableSection>
  );
};

export default AggregationSettings;
