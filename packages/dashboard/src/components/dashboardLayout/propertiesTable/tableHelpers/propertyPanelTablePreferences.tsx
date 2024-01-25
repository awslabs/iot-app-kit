import CollectionPreferences, {
  CollectionPreferencesProps,
} from '@cloudscape-design/components/collection-preferences';
import React from 'react';

type AllPreferences = NonNullable<CollectionPreferencesProps['preferences']>;
type Preferences<P extends AllPreferences> = P;
interface PropertyPanelTablePreferencesProps<P extends AllPreferences> {
  preferences: Preferences<P>;
  updatePreferences: (preferences: Preferences<P>) => void;
}
export function PropertyPanelTablePreferences<P extends AllPreferences>({
  preferences,
  updatePreferences,
}: PropertyPanelTablePreferencesProps<P>) {
  return (
    <CollectionPreferences
      title='Property panel preferences'
      confirmLabel='Confirm'
      cancelLabel='Cancel'
      preferences={preferences}
      onConfirm={({ detail }) => {
        updatePreferences(detail as typeof preferences);
      }}
      pageSizePreference={{
        title: 'Select page size',
        options: [10, 25, 100, 250].map((size) => ({
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
            label: 'Show Properties',
            options: [
              {
                id: 'name',
                label: 'name',
              },
              { id: 'assetName', label: 'asset name' },
              { id: 'latestValue', label: 'latest value' },
              { id: 'showYAxis', label: 'show Y axis' },
              { id: 'yMin', label: 'Y min' },
              { id: 'yMax', label: 'Y max' },
              { id: 'lineType', label: 'line type' },
              { id: 'lineStyle', label: 'line style' },
              { id: 'lineThickness', label: 'line thickness' },
            ],
          },
        ],
      }}
    />
  );
}
