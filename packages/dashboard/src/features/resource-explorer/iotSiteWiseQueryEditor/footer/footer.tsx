import React, { memo } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

import './index.css';

export type ResourceExplorerFooterOptions = {
  addDisabled?: boolean;
  resetDisabled?: boolean;
  onReset?: VoidFunction;
  onAdd?: VoidFunction;
};

export const ResourceExplorerFooter = memo(function ({
  addDisabled,
  resetDisabled,
  onAdd,
  onReset,
}: ResourceExplorerFooterOptions) {
  console.log('rendering footer');
  return (
    <div className='queryeditor-button-sticky'>
      <Box float='right' padding='xs'>
        <SpaceBetween direction='horizontal' size='xs'>
          <Button disabled={resetDisabled} onClick={onReset}>
            Reset
          </Button>
          <Button variant='primary' disabled={addDisabled} onClick={onAdd}>
            Add
          </Button>
        </SpaceBetween>
      </Box>
    </div>
  );
});
