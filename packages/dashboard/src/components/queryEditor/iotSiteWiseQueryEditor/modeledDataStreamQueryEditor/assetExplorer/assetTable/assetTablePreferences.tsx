import CollectionPreferences, {
  type CollectionPreferencesProps,
} from '@cloudscape-design/components/collection-preferences';
import React from 'react';

import { SUPPORTED_PAGE_SIZES } from '../../../constants';

type AllPreferences = NonNullable<CollectionPreferencesProps['preferences']>;
type Preferences<P extends AllPreferences> = P;

export interface AssetTablePreferencesProps<P extends AllPreferences> {
  preferences: Preferences<P>;
  updatePreferences: (preferences: Preferences<P>) => void;
}

export function AssetTablePreferences<P extends AllPreferences>({
  preferences,
  updatePreferences,
}: AssetTablePreferencesProps<P>) {
  return (
    <CollectionPreferences
      title='Asset preferences'
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
            label: `Asset fields`,
            options: [
              { id: 'arn', label: 'ARN' },
              { id: 'id', label: 'ID' },
              { id: 'name', label: 'Name' },
              { id: 'description', label: 'Description' },
              { id: 'creationDate', label: 'Creation date' },
              { id: 'lastUpdateDate', label: 'Last update date' },
            ],
          },
        ],
      }}
      stickyColumnsPreference={{
        firstColumns: {
          title: 'Stick first column(s)',
          description:
            'Keep the first column(s) visible while horizontally scrolling the table content.',
          options: [
            { label: 'None', value: 0 },
            { label: 'First column', value: 1 },
          ],
        },
      }}
    />
  );
}
