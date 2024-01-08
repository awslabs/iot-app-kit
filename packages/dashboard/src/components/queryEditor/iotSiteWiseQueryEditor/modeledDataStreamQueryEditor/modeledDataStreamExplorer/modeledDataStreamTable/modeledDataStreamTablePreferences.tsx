import CollectionPreferences, {
  type CollectionPreferencesProps,
} from '@cloudscape-design/components/collection-preferences';
import React from 'react';

import { SUPPORTED_PAGE_SIZES } from '../../../constants';

type AllPreferences = NonNullable<CollectionPreferencesProps['preferences']>;
type Preferences<P extends AllPreferences> = P;

interface ModeledDataStreamTablePreferencesProps<P extends AllPreferences> {
  preferences: Preferences<P>;
  updatePreferences: (preferences: Preferences<P>) => void;
}

export function ModeledDataStreamTablePreferences<P extends AllPreferences>({
  preferences,
  updatePreferences,
}: ModeledDataStreamTablePreferencesProps<P>) {
  return (
    <CollectionPreferences
      title='Asset property preferences'
      confirmLabel='Confirm'
      cancelLabel='Cancel'
      preferences={preferences}
      onConfirm={({ detail }) => {
        updatePreferences(detail as typeof preferences);
      }}
      pageSizePreference={{
        title: 'Select page size',
        options: SUPPORTED_PAGE_SIZES.map((size) => ({
          value: size,
          label: size.toString(),
        })),
      }}
      wrapLinesPreference={{
        label: 'Wrap lines',
        description: 'Select to see all the text and wrap the lines',
      }}
      stripedRowsPreference={{
        label: 'Striped rows',
        description: 'Select to add alternating shaded rows',
      }}
      visibleContentPreference={{
        title: 'Select visible content',
        options: [
          {
            label: `Asset property fields`,
            options: [
              { id: 'id', label: 'ID' },
              { id: 'alias', label: 'Alias' },
              { id: 'name', label: 'Name' },
              { id: 'latestValue', label: 'Latest values' },
              { id: 'latestValueTime', label: 'Latest value times' },
              { id: 'assetName', label: 'Asset name' },
              { id: 'dataType', label: 'Data type' },
              { id: 'dataTypeSpec', label: 'Data type spec' },
              { id: 'unit', label: 'Unit' },
            ],
          },
        ],
      }}
    />
  );
}
