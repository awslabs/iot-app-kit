import useLocalStorage from 'react-use/lib/useLocalStorage';
import type { CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
const DEFAULT_PREFERENCES = {
  pageSize: 10,
  wrapLines: true,
  stripedRows: false,
  stickyColumns: { first: 1 },
} satisfies CollectionPreferencesProps['preferences'];
export const usePreferences = () => {
  const initializer = {
    ...DEFAULT_PREFERENCES,
    visibleContent: [
      'name',
      'latestValue',
      'assetName',
      'showYAxis',
      'yMin',
      'yMax',
      'lineType',
      'lineStyle',
      'lineThickness',
    ],
  };

  // the storage name is unique to the resource name
  const storageKey = `dashboard-layout-property-panel-preferences`;
  const [preferences = initializer, setPreferences] = useLocalStorage(
    storageKey,
    initializer
  );

  return [preferences, setPreferences] as const;
};
