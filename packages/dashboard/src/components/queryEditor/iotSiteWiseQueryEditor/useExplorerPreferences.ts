import { type CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import useLocalStorage from 'react-use/lib/useLocalStorage';

const DEFAULT_PREFERENCES = {
  pageSize: 250,
  wrapLines: true,
  stripedRows: false,
  stickyColumns: { first: 1 },
} satisfies CollectionPreferencesProps['preferences'];

export interface UseExplorerPreferencesOptions {
  defaultVisibleContent: string[];
  resourceName: string;
}

/** Use to store <Explorer /> component preferences in local storage. */
export function useExplorerPreferences({
  defaultVisibleContent,
  resourceName,
}: UseExplorerPreferencesOptions) {
  const initializer = {
    ...DEFAULT_PREFERENCES,
    visibleContent: defaultVisibleContent,
  };

  // the storage name is unique to the resource name
  const storageKey = `${resourceName}-preferences`;
  const [preferences = initializer, setPreferences] = useLocalStorage(
    storageKey,
    initializer
  );

  return [preferences, setPreferences] as const;
}
