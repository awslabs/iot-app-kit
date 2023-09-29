import React from 'react';
import type { FC } from 'react';
import { SelectProps, ExpandableSection, Box, Select } from '@cloudscape-design/components';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import type { SiteWiseAssetQuery, SiteWisePropertyAliasQuery } from '@iot-app-kit/source-iotsitewise';
import type { SiteWiseQueryConfig } from '~/customization/widgets/types';
import { AssetPropertyQuery, AssetQuery } from '@iot-app-kit/source-iotsitewise/dist/es/time-series-data/types';
import { getResolutionOptions, getAggregationOptions } from './helpers';
import { useWidgetDataTypeSet } from '~/hooks/useWidgetDataTypeSet';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';

import { Maybe, isJust } from '~/util/maybe';
import { SelectOneWidget } from '../shared/selectOneWidget';

import './section.css';

const defaultMessages = {
  header: 'Aggregations and resolution',
  resolutionLabel: 'Resolution',
  aggregationMessage: 'Aggregation',
};

const Section: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ExpandableSection
    headerText={<ExpandableSectionHeader>{defaultMessages.header}</ExpandableSectionHeader>}
    defaultExpanded
  >
    {children}
  </ExpandableSection>
);

const getAggregationSectionOptions = (
  siteWiseQuery: Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery> | undefined,
  supportsRawData: boolean
) => {
  const { aggregationType, resolution } = siteWiseQuery?.assets?.at(0)?.properties?.at(0) ?? {};

  const dataTypeSet = useWidgetDataTypeSet(siteWiseQuery);
  const filteredResolutionOptions = getResolutionOptions(supportsRawData);
  const filteredAggregationOptions = getAggregationOptions(supportsRawData, dataTypeSet, resolution);

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

type AggregationSettingsProps = {
  queryConfig: Maybe<SiteWiseQueryConfig['query']>;
  updateQuery: (newValue: SiteWiseQueryConfig['query']) => void;
  supportsRawData: boolean;
};
const AggregationSettings: FC<AggregationSettingsProps> = ({ queryConfig, updateQuery, supportsRawData }) => {
  const aggregationsEnabled = isJust(queryConfig);

  if (!aggregationsEnabled)
    return (
      <Section>
        <SelectOneWidget />
      </Section>
    );

  const siteWiseAssetQuery = queryConfig.value;

  const { filteredResolutionOptions, filteredAggregationOptions, selectedAggregation, selectedResolution } =
    getAggregationSectionOptions(siteWiseAssetQuery as SiteWiseAssetQuery, supportsRawData);

  // given a resolution, determine what the new aggregation should be
  const getUpdatedAggregation = (resolution?: string) => {
    // resolution is raw
    if (resolution === '0') return undefined;
    // if a chart cannot represent raw data an aggregation must always be present
    if (!resolution && !supportsRawData) return undefined;
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
    const assets = siteWiseAssetQuery.assets?.map((asset: AssetQuery) => ({
      ...asset,
      properties: asset.properties.map((assetProp: AssetPropertyQuery) => ({
        ...assetProp,
        resolution: detail.selectedOption.value,
        aggregationType: newAggregation as AggregateType,
      })),
    }));

    const properties = siteWiseAssetQuery.properties?.map((property) => ({
      ...property,
      resolution: detail.selectedOption.value,
      aggregationType: newAggregation as AggregateType,
    }));

    updateQuery({ assets, properties });
  };

  const onUpdateAggregation: SelectProps['onChange'] = ({ detail }) => {
    if (!siteWiseAssetQuery) return;

    const newAggregation = detail.selectedOption.value as AggregateType;
    const newResolution = getUpdatedResolution(newAggregation);

    // new assets with updated resolution and aggregation
    const assets = siteWiseAssetQuery.assets?.map((asset: AssetQuery) => ({
      ...asset,
      properties: asset.properties.map((assetProp: AssetPropertyQuery) => ({
        ...assetProp,
        resolution: newResolution,
        aggregationType: newAggregation,
      })),
    }));

    const properties = siteWiseAssetQuery.properties?.map((property) => ({
      ...property,
      resolution: newResolution,
      aggregationType: newAggregation,
    }));

    updateQuery({ assets, properties });
  };

  return (
    <Section>
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
    </Section>
  );
};

export default AggregationSettings;
