import CloudscapeCollectionPreferences from '@cloudscape-design/components/collection-preferences';

import { DEFAULT_SUPPORTED_PAGE_SIZES } from '../constants/defaults';

import React from 'react';
import { ResourceName } from '../types/common';
import {
  OnUpdateTableUserCustomization,
  TableResourceField,
  UserCustomization,
} from '../types/table';

export interface ResourceTableUserSettingsProps<Resource> {
  resourceName: ResourceName;
  resourceFields: TableResourceField<Resource>[];
  userCustomization: UserCustomization;
  onUpdateUserCustomization: OnUpdateTableUserCustomization;
}

export function ResourceTableUserSettings<Resource>({
  resourceName,
  resourceFields,
  userCustomization,
  onUpdateUserCustomization,
}: ResourceTableUserSettingsProps<Resource>) {
  const contentDisplayPreferenceOptions = resourceFields.map(
    ({ id, name: label }) => ({
      id,
      label,
    })
  );

  return (
    <CloudscapeCollectionPreferences
      preferences={userCustomization}
      onConfirm={({ detail }) => {
        const settings = {
          ...detail,
          columnDisplay:
            detail.contentDisplay?.map(({ id, visible }) => ({
              id,
              isVisible: visible,
            })) ?? userCustomization.columnDisplay,
        };

        onUpdateUserCustomization(settings as UserCustomization);
      }}
      contentDensityPreference={{}}
      // TODO: Handle internationalization for sticky columns preference
      stickyColumnsPreference={{
        firstColumns: {
          title: 'Sticky first columns',
          description: 'Select the number of columns from the start to stick.',
          options: [
            {
              label: 'First column',
              value: 1,
            },
            {
              label: 'First two columns',
              value: 2,
            },
          ],
        },
        lastColumns: {
          title: 'Sticky last columns',
          description: 'Select the number of columns from the end to stick.',
          options: [
            {
              label: 'Last column',
              value: 1,
            },
            {
              label: 'Last two columns',
              value: 2,
            },
          ],
        },
      }}
      pageSizePreference={{
        options: DEFAULT_SUPPORTED_PAGE_SIZES.map((size) => ({
          value: size,
          label: `${size.toString()} ${resourceName.toLowerCase()}`,
        })),
      }}
      wrapLinesPreference={{}}
      stripedRowsPreference={{}}
      contentDisplayPreference={{
        options: contentDisplayPreferenceOptions,
      }}
    />
  );
}
