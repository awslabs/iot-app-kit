import React from 'react';

import { Alert, Box, SpaceBetween } from '@cloudscape-design/components';

export const ResourceExplorerErrorState = ({ title }: { title?: string }) => {
  return (
    <Box variant='h3'>
      <SpaceBetween size='s'>
        {title && <label> {title}</label>}
        <Alert dismissible statusIconAriaLabel='Error' type='error' header='an error has occurred.' />
      </SpaceBetween>
    </Box>
  );
};
