import React, { type PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

export type QueryEditorErrorBoundaryProps = PropsWithChildren;

export function QueryEditorErrorBoundary({ children }: QueryEditorErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <Box padding={{ top: 'l' }} textAlign='center'>
          <b>An error occured.</b>

          <Box variant='p' color='inherit'>
            An error occurred when displaying the query editor.
          </Box>

          <Box>
            <Link
              external
              href={`https://github.com/awslabs/iot-app-kit/issues/new?labels=bug&title=+Query+editor+failed+to+display&body=${error.message}&labels=bug`}
            >
              Report the error
            </Link>
          </Box>
        </Box>
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}

function handleError(error: Error) {
  const errorMessage = `An error has triggered <QueryEditor />'s error boundary and the component has failed to render. Error: ${error}`;
  console.error(errorMessage);
}
