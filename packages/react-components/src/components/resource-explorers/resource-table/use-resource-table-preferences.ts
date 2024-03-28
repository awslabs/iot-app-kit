import useLocalStorage from 'react-use/lib/useLocalStorage';
import type { ResourceSchema, ResourceTablePreferences } from './types';

export interface UseResourceTablePreferencesOptions<Resource> {
  schema: ResourceSchema<Resource>;
}

export type UseResourceTablePreferencesResult = readonly [
  ResourceTablePreferences,
  SetResourceTablePreferences
];

type SetResourceTablePreferences = (
  preferences: ResourceTablePreferences
) => void;

const BASE_DEFAULT_PREFERENCES = {
  contentDensity: 'comfortable',
  pageSize: 10,
  wrapLines: true,
  stripedRows: false,
  stickyColumns: { first: 1 },
} satisfies ResourceTablePreferences;

export function useResourceTablePreferences<Resource>({
  schema,
}: UseResourceTablePreferencesOptions<Resource>): UseResourceTablePreferencesResult {
  const defaultPreferences = deriveDefaultPreferences(schema);
  console.log(defaultPreferences);

  // The storage name is unique to the resource name
  const storageKey = `${schema.name}-table-preferences`;
  const [preferences = defaultPreferences, setPreferences] = useLocalStorage(
    storageKey,
    defaultPreferences
  );

  return [preferences, setPreferences] as const;
}

function deriveDefaultPreferences<Resource>(
  schema: ResourceSchema<Resource>
): ResourceTablePreferences {
  const contentDisplayPreferenceDefaults = schema.properties.map(({ id }) => ({
    id,
    visible: true,
  }));

  const defaultPreferences = {
    ...BASE_DEFAULT_PREFERENCES,
    contentDisplay: contentDisplayPreferenceDefaults,
  };

  return defaultPreferences;
}
