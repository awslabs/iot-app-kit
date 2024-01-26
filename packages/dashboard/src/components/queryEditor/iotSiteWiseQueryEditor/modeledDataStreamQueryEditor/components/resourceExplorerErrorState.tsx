import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

export const ResourceExplorerErrorState = ({ title }: { title?: string }) => {
  return (
    <Box variant='h3'>
      <SpaceBetween size='s'>
        {title && <label> {title}</label>}
        <Alert
          dismissible
          statusIconAriaLabel='Error'
          type='error'
          header='an error has occurred.'
          dismissAriaLabel='cancel'
        />
      </SpaceBetween>
    </Box>
  );
};
