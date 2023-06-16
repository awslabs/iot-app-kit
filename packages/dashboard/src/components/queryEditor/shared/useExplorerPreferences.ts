import { type CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import useLocalStorage from 'react-use/lib/useLocalStorage';

const DEFAULT_PREFERENCES = {
  pageSize: 10,
  wrapLines: true,
  stripedRows: false,
  stickyColumns: { first: 1 },
} as const satisfies CollectionPreferencesProps['preferences'];

interface UsePreferencesProps {
  defaultVisibleContent: string[];
  resourceName: string;
}

/** Use to store <Explorer /> component preferences in local storage. */
export function useExplorerPreferences({ defaultVisibleContent, resourceName }: UsePreferencesProps) {
  const initializer = {
    ...DEFAULT_PREFERENCES,
    visibleContent: defaultVisibleContent,
  };

  // the storage name is unique to the resource name
  const storageKey = `${resourceName}-preferences`;
  const [preferences = initializer, setPreferences] = useLocalStorage(storageKey, initializer);

  return [preferences, setPreferences] as const;
}
