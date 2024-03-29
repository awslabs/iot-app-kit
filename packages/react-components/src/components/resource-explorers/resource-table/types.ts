import { type CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';

export interface ResourceSchema<Resource> {
  name: string;
  pluralName: string;
  properties: ResourcePropertySchema<Resource>[];
}

interface ResourcePropertySchema<Resource> {
  id: string;
  name: string;
  pluralName: string;
  render: (resource: Resource) => string | React.ReactNode;
  filterOperators?: ('=' | '!=' | '>' | '>=' | '<' | '<=' | ':' | '!:')[];
}

export type ResourceTablePreferences = Omit<
  Required<NonNullable<CollectionPreferencesProps['preferences']>>,
  'visibleContent' | 'custom'
>;
