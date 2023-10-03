import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import Button from '@cloudscape-design/components/button';
import Form from '@cloudscape-design/components/form';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';
import { useForm } from 'react-hook-form';

import { WorkspaceSelector } from './workspaceSelector';
import { SearchQueryInput } from './searchQueryInput';
import type { SearchFields } from './types';

export interface DataStreamSearchProps {
  client: IoTTwinMakerClient;
  onSubmit: ({ workspace, searchQuery }: SearchFields) => void;
}

export function DataStreamSearch({ onSubmit, client }: DataStreamSearchProps) {
  const { control, handleSubmit } = useForm<SearchFields>({
    defaultValues: { workspace: null, searchQuery: '' },
  });

  return (
    <SpaceBetween size='xxs'>
      <Header variant='h3' description='Search for modeled data streams by name or by the associated asset.'>
        Search modeled data streams
      </Header>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          void handleSubmit((data) => {
            onSubmit(data);
          })();
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
            <SearchQueryInput control={control} />
            <WorkspaceSelector control={control} client={client} />
          </SpaceBetween>
        </Form>
      </form>
    </SpaceBetween>
  );
}
