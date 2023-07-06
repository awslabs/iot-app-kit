import { Property } from '../model/property';

export const columnDefinitions = [
  {
    id: 'displayName',
    header: 'Display name',
    cell: (e: Property) => e.displayName,
    ariaLabel: () => 'Display name',
    sortingField: 'displayName',
    isRowHeader: true,
  },
  {
    id: 'propertyName',
    header: 'Property name',
    cell: (e: Property) => e.propertyName,
    ariaLabel: () => 'Property name',
    sortingField: 'propertyName',
  },
  {
    id: 'assetName',
    header: 'Asset name',
    cell: (e: Property) => e.assetName,
    ariaLabel: () => 'Asset name',
    sortingField: 'assetName',
  },
];

const pageSizePreference = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 resources' },
    { value: 20, label: '20 resources' },
    { value: 30, label: '30 resources' },
    { value: 50, label: '50 resources' },
    { value: 100, label: '100 resources' },
  ],
};

const visibleContentPreference = {
  title: 'Select visible content',
  options: [
    {
      label: 'Property fields',
      options: [
        { id: 'displayName', label: 'Display Name' },
        { id: 'propertyName', label: 'Property Name' },
        { id: 'assetName', label: 'Asset Name' },
      ],
    },
  ],
};

export const paginationLabels = {
  nextPageLabel: 'Next page',
  pageLabel: (pageNumber: number) => `Go to page ${pageNumber}`,
  previousPageLabel: 'Previous page',
};

export const collectionPreferencesProps = {
  pageSizePreference,
  visibleContentPreference,
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  title: 'Preferences',
};
