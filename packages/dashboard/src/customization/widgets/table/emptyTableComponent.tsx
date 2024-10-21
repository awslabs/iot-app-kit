import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React, { memo } from 'react';

export const EmptyTableComponent = memo(function () {
  return (
    <Box
      data-testid='emptyStateTableDisplay'
      margin={{ vertical: 'xs' }}
      textAlign='center'
      color='inherit'
    >
      <SpaceBetween size='m'>
        <b data-testid='default-msg'>No data to display</b>
      </SpaceBetween>
    </Box>
  );
});
