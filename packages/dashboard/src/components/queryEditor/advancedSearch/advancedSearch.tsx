import * as React from 'react';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import TextContent from '@cloudscape-design/components/text-content';
import Checkbox from '@cloudscape-design/components/checkbox';
import { useState, useMemo, useCallback } from 'react';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { createKnowledgeGraphQueryClient } from '@iot-app-kit/react-components/src/components/knowledge-graph/KnowledgeGraphQueries';
import { ResponseParser } from '@iot-app-kit/react-components/src/components/knowledge-graph/responseParser';
import { initialize } from '@iot-app-kit/source-iottwinmaker';

interface Props {
  client: IoTSiteWiseClient;
  onDismiss: () => void;
  onSubmit: (assetIds?: string[]) => void;
}

/** Advanced search for exploring your AWS IoT SiteWise properties. */
export function AdvancedSearch(props: Props) {
  const [searchTermInput, setSearchTermInput] = useState('');
  const [assetsChecked, setAssetsChecked] = useState(false);
  const [propertiesChecked, setPropertiesChecked] = useState(false);

  // TODO: get creds/region differently. KG data module requires either awsCreds or multiple sdk clients (twinmaker, sitewise, s3, kinesis, secrets manager)
  const { kGDatamodule } = initialize('CenturionTest', {
    awsCredentials: props.client.config.credentials,
    awsRegion: 'us-east-1',
  });

  const kGResponse = (res: ExecuteQueryCommandOutput) => {
    const { nodeData, edgeData } = ResponseParser.parse(
      res ? res['rows'] : null,
      res ? res['columnDescriptions'] : null
    );

    // Assets
    console.log('Assets');
    console.log(nodeData);

    // Propreties
    console.log('Properties');
    console.log(edgeData);
  };

  const knowledgeGraphQueryClient = useMemo(() => {
    return createKnowledgeGraphQueryClient(kGDatamodule(), kGResponse);
  }, [kGDatamodule(), kGResponse]);

  const onSearchClicked = useCallback(() => {
    if (searchTermInput) {
      knowledgeGraphQueryClient.findEntitiesByName(searchTermInput);
    }
  }, [knowledgeGraphQueryClient, searchTermInput]);

  return (
    <Modal
      onDismiss={props.onDismiss}
      visible={true}
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={props.onDismiss} variant='link'>
              Cancel
            </Button>
            <Button onClick={onSearchClicked} variant='primary'>
              Search
            </Button>
          </SpaceBetween>
        </Box>
      }
      header='Advanced Search'
    >
      <SpaceBetween direction='vertical' size='l'>
        <FormField label='Search term' description='This will search across all assets within the root'>
          <Input value={searchTermInput} onChange={({ detail }) => setSearchTermInput(detail.value)} />
        </FormField>
        <TextContent>
          <SpaceBetween direction='vertical' size='xxxs'>
            <strong>Result Types</strong>
            <small>Specify which things you're searching for</small>
            <Checkbox onChange={({ detail }) => setAssetsChecked(detail.checked)} checked={assetsChecked}>
              Assets
            </Checkbox>
            <Checkbox onChange={({ detail }) => setPropertiesChecked(detail.checked)} checked={propertiesChecked}>
              Properties
            </Checkbox>
          </SpaceBetween>
        </TextContent>
      </SpaceBetween>
    </Modal>
  );
}
