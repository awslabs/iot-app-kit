import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import {
  Button,
  Form,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { WorkspaceSelector } from './workspaceSelector';
import { SearchQueryInput } from './searchQueryInput';
import type { SearchFields } from './types';
import { WorkspaceErrorState } from './workspaceErrorState';
import { getPlugin } from '@iot-app-kit/core';

export interface DataStreamSearchProps {
  client: IoTTwinMakerClient;
  onSubmit: ({ workspace, searchQuery }: SearchFields) => void;
}

export const DataStreamSearch = ({
  onSubmit,
  client,
}: DataStreamSearchProps) => {
  const metricsRecorder = getPlugin('metricsRecorder');
  const { control, handleSubmit, setValue } = useForm<SearchFields>({
    defaultValues: { workspace: null, searchQuery: '' },
  });

  const [isError, setIsError] = useState<boolean>();

  return (
    <SpaceBetween size='xxs'>
      <Header
        variant='h3'
        description='Search for modeled data streams by name or by the associated asset.'
      >
        Search modeled data streams
      </Header>

      {isError && <WorkspaceErrorState />}

      <form
        onSubmit={(event) => {
          event.preventDefault();

          void handleSubmit((data) => {
            onSubmit(data);
          })();

          metricsRecorder?.record({
            metricName: 'ModeledDataStreamSearch',
            metricValue: 1,
          });
        }}
      >
        <Form
          actions={
            <Button iconName='search' variant='primary'>
              Search
            </Button>
          }
        >
          <SpaceBetween size='s'>
            <SearchQueryInput control={control} disabled={isError} />
            <WorkspaceSelector
              control={control}
              client={client}
              OnGettingError={setIsError}
              setValue={setValue}
            />
          </SpaceBetween>
        </Form>
      </form>
    </SpaceBetween>
  );
};
