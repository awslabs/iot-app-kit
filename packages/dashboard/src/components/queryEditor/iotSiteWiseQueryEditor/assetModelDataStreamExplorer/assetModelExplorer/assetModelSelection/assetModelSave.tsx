import React from 'react';

import Box from '@cloudscape-design/components/box';

import Button from '@cloudscape-design/components/button';

type AssetModelSaveOptions = {
  onSave: () => void;
  disabled?: boolean;
};

export const AssetModelSave = ({ onSave, disabled }: AssetModelSaveOptions) => {
  return (
    <Box float='right'>
      <Button disabled={disabled} onClick={onSave}>
        Set asset model
      </Button>
    </Box>
  );
};
