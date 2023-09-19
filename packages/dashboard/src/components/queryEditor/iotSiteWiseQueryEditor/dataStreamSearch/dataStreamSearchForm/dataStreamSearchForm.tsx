import { AssetSummary, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import Button from '@cloudscape-design/components/button';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { WorkspaceSelector } from './workspaceSelector';
import { SearchQueryInput } from './searchQueryInput';
import type { SearchFields } from '../types';
import { Box, FormField, Header, Modal } from '@cloudscape-design/components';
import { AssetExplorer } from '../../modeledDataStreamQueryEditor/assetExplorer';

export interface DataStreamSearchFormProps {
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
  onSubmit: ({ workspace, searchQuery }: SearchFields) => void;
}

export function DataStreamSearchForm({ onSubmit, iotSiteWiseClient, iotTwinMakerClient }: DataStreamSearchFormProps) {
  const { control, handleSubmit } = useForm<SearchFields>({
    defaultValues: { workspace: null, searchQuery: '' },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  function onClickSelectRoot() {
    setIsModalOpen(true);
  }

  const [tempSearchRoot, setTempSearchRoot] = useState<AssetSummary | undefined>(undefined);
  const [searchRoot, setSearchRoot] = useState<AssetSummary | undefined>();

  function onClickCancel() {
    setTempSearchRoot(undefined);
    setIsModalOpen(false);
  }

  function onClickSelect() {
    setSearchRoot(tempSearchRoot);
    setTempSearchRoot(undefined);
    setIsModalOpen(false);
  }

  return (
    <>
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
              <WorkspaceSelector control={control} client={iotTwinMakerClient} />
              <FormField
                label={
                  <span>
                    Search root asset <i>- optional</i>{' '}
                  </span>
                }
                description='Select a search root asset to limit the search to a specific asset and its descendants.'
              >
                <Button formAction='none' onClick={onClickSelectRoot}>
                  Select root
                </Button>
                <Box>
                  Selected search root: {searchRoot?.name ?? 'No root selected'}
                  {searchRoot && <Button onClick={() => setSearchRoot(undefined)}>X</Button>}
                </Box>
              </FormField>
            </SpaceBetween>
          </Form>
        </form>
      </SpaceBetween>

      <Modal
        visible={isModalOpen}
        header={
          <Header
            variant='h3'
            description='Select a search root asset to limit the search to a specific asset and its descendants.'
          >
            Select search root asset
          </Header>
        }
        footer={
          <Box float='right'>
            <SpaceBetween direction='horizontal' size='xs'>
              <Button onClick={onClickCancel}>Cancel</Button>
              <Button variant='primary' onClick={onClickSelect} disabled={!tempSearchRoot}>
                Select
              </Button>
            </SpaceBetween>
          </Box>
        }
        onDismiss={onClickCancel}
      >
        <AssetExplorer onSelect={setTempSearchRoot} isWithoutHeader client={iotSiteWiseClient} />
      </Modal>
    </>
  );
}
