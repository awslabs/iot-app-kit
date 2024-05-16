import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import React, { type PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export type ResourceExplorerErrorBoundaryProps = PropsWithChildren;

export function ResourceExplorerErrorBoundary({
  children,
}: ResourceExplorerErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }: { error: Error }) => (
        <Box padding={{ top: 'l' }} textAlign='center'>
          <b>An error occured.</b>

          <Alert type='error'>{error.message}</Alert>
        </Box>
      )}
      onError={console.error}
    >
      {children}
    </ErrorBoundary>
  );
}
