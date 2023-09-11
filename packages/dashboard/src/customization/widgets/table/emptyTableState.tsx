import React from 'react';
import { Box, Button, SpaceBetween } from '@cloudscape-design/components';
import type { FunctionComponent } from 'react';

const EmptyTableState: FunctionComponent = () => {
  return (
    <Box data-testid='emptyStateTableDisplay' margin={{ vertical: 'xs' }} textAlign='center' color='inherit'>
      <SpaceBetween size='m'>
        <b data-testid='default-msg'>No data to display</b>
        <Button>Add asset properties</Button>
      </SpaceBetween>
    </Box>
  );
};

export default EmptyTableState;
