import React from 'react';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';

export type ResourceExplorerFooterOptions = {
  addDisabled?: boolean;
  resetDisabled?: boolean;
  onReset?: () => void;
  onAdd?: () => void;
};

export const ResourceExplorerFooter = ({
  addDisabled,
  resetDisabled,
  onAdd,
  onReset,
}: ResourceExplorerFooterOptions) => {
  return (
    <Box float='right'>
      <SpaceBetween direction='horizontal' size='xs'>
        <Button disabled={resetDisabled} onClick={onReset}>
          Reset
        </Button>
        <Button variant='primary' disabled={addDisabled} onClick={onAdd}>
          Add
        </Button>
      </SpaceBetween>
    </Box>
  );
};
