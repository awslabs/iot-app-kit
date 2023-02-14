import Box from '@awsui/components-react/box';
import * as React from 'react';

export interface EmptyStateProps {
  header?: string;
  description?: string;
}

export const EmptyState = (props: EmptyStateProps) => {
  const { header, description } = props;
  return (
    <Box textAlign='center' color='inherit'>
      {header && (
        <Box variant='strong' textAlign='center' color='inherit'>
          {header}
        </Box>
      )}
      {description && (
        <Box variant='p' padding={{ bottom: 's' }} color='inherit'>
          {description}
        </Box>
      )}
    </Box>
  );
};
