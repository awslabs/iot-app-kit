import type { CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import type { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import type { TableProps } from '@cloudscape-design/components/table';

import type { ResourceSchema } from './types';

type ColumnDefinitions = NonNullable<TableProps['columnDefinitions']>;
type FilteringProperties = PropertyFilterProps['filteringProperties'];
type ContentDisplayPreferenceOption = NonNullable<
  CollectionPreferencesProps['contentDisplayPreference']
>['options'][number];

interface SchemaDerivative {
  columnDefinitions: ColumnDefinitions;
  filteringProperties: FilteringProperties;
  contentDisplayPreferenceOptions: ContentDisplayPreferenceOption[];
}

export function deriveSchema<Resource>(
  schema: ResourceSchema<Resource>
): SchemaDerivative {
  const columnDefinitions = deriveColumnDefinitions(schema);
  const filteringProperties = deriveFilteringProperties(schema);
  const contentDisplayPreferenceOptions =
    deriveContentDisplayPreferenceOptions(schema);

  return {
    columnDefinitions,
    filteringProperties,
    contentDisplayPreferenceOptions,
  };
}

function deriveColumnDefinitions<Resource>(
  schema: ResourceSchema<Resource>
): ColumnDefinitions {
  const columnDefinitions = schema.properties.map((propertySchema) => ({
    id: propertySchema.id,
    header: propertySchema.name,
    cell: propertySchema.render,
    sortingField: propertySchema.id,
  }));

  return columnDefinitions;
}

function deriveFilteringProperties<Resource>(
  schema: ResourceSchema<Resource>
): FilteringProperties {
  const filteringProperties = schema.properties
    .filter(({ filterOperators = [] }) => filterOperators.length > 0)
    .map((propertyschema) => ({
      key: propertyschema.id,
      propertyLabel: propertyschema.name,
      groupValuesLabel: propertyschema.pluralName,
    }));

  return filteringProperties;
}

function deriveContentDisplayPreferenceOptions<Resource>(
  schema: ResourceSchema<Resource>
): ContentDisplayPreferenceOption[] {
  const contentDisplayPreferenceOptions = schema.properties.map(
    ({ id, name }) => ({
      id,
      label: name,
    })
  );

  return contentDisplayPreferenceOptions;
}
