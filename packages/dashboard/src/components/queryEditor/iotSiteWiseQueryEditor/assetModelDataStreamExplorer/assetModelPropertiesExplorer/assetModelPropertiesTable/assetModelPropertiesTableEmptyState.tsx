import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

type AssetModelPropertiesTableEmptyStateOptions = {
  isError: boolean;
  retry: () => void;
};

export function AssetModelPropertiesTableEmptyState({
  isError,
  retry,
}: AssetModelPropertiesTableEmptyStateOptions) {
  const emptyState = (
    <>
      <b>No asset model properties.</b>

      <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
        No asset model properties to display.
      </Box>
    </>
  );

  const errorState = (
    <>
      <b>Error fetching asset model properties.</b>

      <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
        <Button variant='link' onClick={retry}>
          Retry
        </Button>
      </Box>
    </>
  );

  return (
    <Box textAlign='center' color='inherit'>
      {isError ? errorState : emptyState}
    </Box>
  );
}
