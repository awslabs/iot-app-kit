import type { PropertyFilterProps } from '@cloudscape-design/components/property-filter';

export const PROPERTIES_PANEL_FILTERING_PROPERTIES: PropertyFilterProps['filteringProperties'] =
  [
    {
      key: 'name',
      propertyLabel: 'Name',
      groupValuesLabel: 'Property names',
      operators: ['=', '!=', ':', '!:'],
    },
    {
      key: 'assetName',
      propertyLabel: 'Asset name',
      groupValuesLabel: 'Asset names',
      operators: ['=', '!=', ':', '!:'],
    },
    {
      key: 'latestValue',
      propertyLabel: 'Latest value',
      groupValuesLabel: 'Latest values',
      operators: ['=', '!=', '>', '>=', '<', '<='],
    },
  ];
