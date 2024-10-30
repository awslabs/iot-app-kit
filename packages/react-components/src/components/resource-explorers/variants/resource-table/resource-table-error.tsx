import Alert from '@cloudscape-design/components/alert';
import React from 'react';

export interface ResourceTableErrorProps {
  error: Error;
}

export function ResourceTableError({ error }: ResourceTableErrorProps) {
  return (
    <Alert
      statusIconAriaLabel='Error'
      type='error'
      header='An error has occurred.'
    >
      {error.message}
    </Alert>
  );
}
