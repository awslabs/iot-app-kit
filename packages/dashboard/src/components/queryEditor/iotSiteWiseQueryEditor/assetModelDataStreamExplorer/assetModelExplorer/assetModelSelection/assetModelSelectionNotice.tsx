import React from 'react';

import Alert from '@cloudscape-design/components/alert';

export const AssetModelSelectionNotice = () => {
  return (
    <Alert statusIconAriaLabel='Info' header='Create an asset model-based template by specifying an asset model'>
      This dashboard may only have one associated asset model. You can modify this later. All assets of this model will
      be available in view mode.
    </Alert>
  );
};
