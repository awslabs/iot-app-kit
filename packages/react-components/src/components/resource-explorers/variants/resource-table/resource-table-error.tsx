import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';

export interface ResourceTableErrorProps {
  pluralResourceName: string;
  error: Error;
}

export function ResourceTableError({
  pluralResourceName,
  error,
}: ResourceTableErrorProps) {
  return (
    <Box variant='h3'>
      <SpaceBetween size='s'>
        <Box variant='h3'>{`${pluralResourceName} (0)`}</Box>
        <Alert
          statusIconAriaLabel='Error'
          type='error'
          header='An error has occurred.'
        >
          {error.message}
        </Alert>
      </SpaceBetween>
    </Box>
  );
}
