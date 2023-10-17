import Box from '@cloudscape-design/components/box';
import React from 'react';

export function AssetModelPropertiesTableEmptyState() {
  return (
    <Box textAlign='center' color='inherit'>
      <b>No asset model properties.</b>

      <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
        No asset model properties to display.
      </Box>
    </Box>
  );
}
