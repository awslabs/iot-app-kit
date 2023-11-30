import React from 'react';
import { Alert, Link, SpaceBetween } from '@cloudscape-design/components';
import { infoMessage, errorMessage } from './constants';

export const WorkspaceErrorState = () => {
  return (
    <SpaceBetween size='s'>
      <Alert statusIconAriaLabel='Info' type='info' dismissible dismissAriaLabel='cancel'>
        {infoMessage}
      </Alert>
      <Alert statusIconAriaLabel='Error' type='error' dismissible dismissAriaLabel='cancel'>
        {errorMessage}&nbsp;
        <Link external href='https://docs.aws.amazon.com/iot-twinmaker/latest/guide/twinmaker-gs-workspace.html'>
          Learn more about creating a workspace
        </Link>
      </Alert>
    </SpaceBetween>
  );
};
