import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, FormField, Input, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import { useStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownSceneProperty } from '../../../interfaces';
import { getGlobalSettings, subscribe, unsubscribe } from '../../../common/GlobalSettings';
import { MATTERPORT_SECRET_ARN, OPTIONS_PLACEHOLDER_VALUE } from '../../../common/constants';
import {
  getMatterportConnectionList,
  getUpdatedSceneInfoForConnection,
} from '../../../utils/matterportIntegrationUtils';

import { MatterportTagSync } from './MatterportTagSync';

export const MatterportIntegration: React.FC = () => {
  const intl = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);

  const getSceneProperty = useStore(sceneComposerId)((state) => state.getSceneProperty);
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);

  const [focusInput, setFocusInput] = useState(false);
  const [matterportModelId, setMatterportModelId] = useState(getSceneProperty(KnownSceneProperty.MatterportModelId));

  const [connectionOptions, setConnectionOptions] = useState<{ label: string; value: string }[]>([
    {
      label: intl.formatMessage({
        defaultMessage: 'Select a connection',
        description: 'Select a connection placeholder',
      }),
      value: OPTIONS_PLACEHOLDER_VALUE,
    },
  ]);
  const [selectedConnectionName, setSelectedConnectionName] = useState(OPTIONS_PLACEHOLDER_VALUE);
  const { setMatterportViewerEnabled } = useViewOptionState(sceneComposerId);
  const twinMakerSceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  const updateSelectedConnectionName = useCallback(async () => {
    if (twinMakerSceneMetadataModule) {
      const getSceneResponse = await twinMakerSceneMetadataModule.getSceneInfo();
      if (getSceneResponse && getSceneResponse.sceneMetadata && getSceneResponse.sceneMetadata[MATTERPORT_SECRET_ARN]) {
        setSelectedConnectionName(getSceneResponse.sceneMetadata[MATTERPORT_SECRET_ARN]);
      } else {
        setSelectedConnectionName(OPTIONS_PLACEHOLDER_VALUE);
      }
    }
  }, [twinMakerSceneMetadataModule]);

  const getConnectionList = useCallback(async () => {
    const connectionList = await getMatterportConnectionList(intl, twinMakerSceneMetadataModule);
    setConnectionOptions(connectionList);
  }, [twinMakerSceneMetadataModule, intl]);

  const onUpdated = useCallback(() => {
    updateSelectedConnectionName();
    getConnectionList();
  }, []);

  useEffect(() => {
    subscribe(onUpdated);
    updateSelectedConnectionName();
    getConnectionList();

    return () => unsubscribe(onUpdated);
  }, []);

  const onConnectionNameChange = useCallback(
    async (event) => {
      const newConnection = event.detail.selectedOption.value;
      if (twinMakerSceneMetadataModule) {
        const updatedSceneInfo = await getUpdatedSceneInfoForConnection(newConnection, twinMakerSceneMetadataModule);
        await twinMakerSceneMetadataModule.updateSceneInfo(updatedSceneInfo);
      }
      setSelectedConnectionName(newConnection);
    },
    [twinMakerSceneMetadataModule],
  );

  const selectedConnection = useMemo(() => {
    const selectedOption = connectionOptions.find((t) => t.value === selectedConnectionName);
    if (selectedOption) {
      return {
        label: selectedOption.label,
        value: selectedOption.value,
      };
    }
    return null;
  }, [connectionOptions, selectedConnectionName]);

  const onInputBlur = useCallback(() => {
    if (getSceneProperty(KnownSceneProperty.MatterportModelId) !== matterportModelId) {
      setSceneProperty(KnownSceneProperty.MatterportModelId, matterportModelId !== '' ? matterportModelId : undefined);
    }
    setFocusInput(false);
  }, [matterportModelId, setFocusInput]);

  const onMatterportModelIdChange = useCallback(
    (event) => {
      const value = event.detail.value;
      if (value !== matterportModelId) {
        setMatterportModelId(value);
      }
    },
    [matterportModelId],
  );

  const enableMatterportViewer = !isEmpty(matterportModelId) && selectedConnectionName !== OPTIONS_PLACEHOLDER_VALUE;

  useEffect(() => {
    if (!focusInput) {
      setMatterportViewerEnabled(enableMatterportViewer);
    }
  }, [focusInput, matterportModelId, selectedConnectionName]);

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        <Box fontWeight='bold'>
          {intl.formatMessage({ description: 'Sub-Section Header', defaultMessage: 'Matterport Integration' })}
        </Box>
        <Box>
          {intl.formatMessage({
            description: 'Sub-Section Description',
            defaultMessage: 'Connecting your Matterport account enables viewing spaces in your TwinMaker scene. ',
          })}
        </Box>
        {connectionOptions.length > 1 && (
          <React.Fragment>
            <FormField
              label={intl.formatMessage({ description: 'Form Field label', defaultMessage: 'Connection Name' })}
            >
              <Select
                selectedOption={selectedConnection}
                onChange={onConnectionNameChange}
                options={connectionOptions}
                selectedAriaLabel={intl.formatMessage({ defaultMessage: 'Selected', description: 'label' })}
                disabled={connectionOptions.length === 0}
                expandToViewport
              />
            </FormField>
            <FormField
              label={intl.formatMessage({ description: 'Form Field label', defaultMessage: 'Matterport Model Id' })}
            >
              <Input
                value={matterportModelId || ''}
                type='text'
                onFocus={() => setFocusInput(true)}
                onBlur={onInputBlur}
                onChange={onMatterportModelIdChange}
                placeholder={intl.formatMessage({
                  defaultMessage: 'Enter your Matterport model id',
                  description: 'Enter your Matterport model id placeholder',
                })}
              />
            </FormField>
          </React.Fragment>
        )}
        {connectionOptions.length <= 1 && (
          <div style={{ textAlign: 'center' }}>
            <SpaceBetween size='xl'>
              <Box fontWeight='bold' textAlign='center'>
                {intl.formatMessage({ description: 'Desction label', defaultMessage: 'No Connections' })}
              </Box>
              <Button
                ariaLabel='Learn more (opens new tab)'
                href='https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html'
                iconAlign='right'
                iconName='external'
                target='_blank'
              >
                {intl.formatMessage({
                  description: 'Button label',
                  defaultMessage: 'Learn more',
                })}
              </Button>
            </SpaceBetween>
          </div>
        )}
        {enableMatterportViewer && <MatterportTagSync />}
      </SpaceBetween>
    </React.Fragment>
  );
};
