import { Box, SpaceBetween } from '@cloudscape-design/components';
import type { FunctionComponent } from 'react';

const EmptyTableComponent: FunctionComponent = () => {
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
};

export default EmptyTableComponent;
