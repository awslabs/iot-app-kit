export const DEFAULT_PREFERENCES = {
  pageSize: 20,
};

export const pageSizePreference = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 resources' },
    { value: 20, label: '20 resources' },
    { value: 30, label: '30 resources' },
  ],
};

export const collectionPreferencesProps = {
  pageSizePreference,
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  title: 'Preferences',
};
