import React from 'react';
import { Header, TextContent } from '@awsui/components-react';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { ERROR_MESSAGE_DICT, SceneComposerRuntimeError } from '../../common/errors';
import { StaticLayout } from '../../layouts/StaticLayout';
import CenteredContainer from '../CenteredContainer';

export default function DefaultErrorFallback(props: { error: Error }) {
  const log = useLifecycleLogging('DefaultErrorFallback');

  const { error } = props;
  let errorTitle: string;
  let errorMessage: string;

  if (error instanceof SceneComposerRuntimeError) {
    errorTitle = 'Error';
    errorMessage = error.details.message;
    log?.error(errorMessage, error.innerError as Error);
  } else {
    errorTitle = 'Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = ERROR_MESSAGE_DICT.UNKNOWN_ERROR;
    }
  }

  return (
    <StaticLayout
      showModal={true}
      modalContent={
        <CenteredContainer header={<Header variant='h2'>{errorTitle}</Header>}>
          <TextContent>
            <p>{errorMessage}</p>
          </TextContent>
        </CenteredContainer>
      }
    />
  );
}
