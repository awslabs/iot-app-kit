import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, FormField, Input, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownSceneProperty } from '../../../interfaces';
import { getGlobalSettings, subscribe, unsubscribe } from '../../../common/GlobalSettings';
import { MatterportTagSync } from './MatterportTagSync';

export const MatterportIntegration: React.FC = () => {
  const log = useLifecycleLogging('MatterportIntegration');
  log?.verbose('Initialize Matterport Integration');

  const intl = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);

  const getSceneProperty = useStore(sceneComposerId)((state) => state.getSceneProperty);
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);

  const [dirty, setDirty] = useState(false);
  const [matterportModelId, setMatterportModelId] = useState(getSceneProperty(KnownSceneProperty.MatterportModelId));
  const [connectionOptions, setConnectionOptions] = useState<{ label: string; value: string }[]>([
    {
      label: intl.formatMessage({
        defaultMessage: 'Select a connection',
        description: 'Select a connection placeholder',
      }),
      value: 'n/a',
    },
  ]);
  const [selectedConnectionName, setSelectedConnectionName] = useState('n/a');

  const updateSelectedConnectionName = async () => {
    const getSceneInfoFunction = getGlobalSettings().getSceneInfoFunction;
    if (getSceneInfoFunction) {
      const getSceneresponse = await getSceneInfoFunction();
      if (getSceneresponse && getSceneresponse.sceneMetadata && getSceneresponse.sceneMetadata.MATTERPORT_SECRET_ARN) {
        setSelectedConnectionName(getSceneresponse.sceneMetadata.MATTERPORT_SECRET_ARN);
      } else {
        setSelectedConnectionName('n/a');
      }
    }
  };

  const getConnectionList = async () => {
    const connectionList: { label: string; value: string }[] = [
      {
        label: intl.formatMessage({
          defaultMessage: 'Select a connection',
          description: 'Select a connection placeholder',
        }),
        value: 'n/a',
      },
    ];
    const get3pConnectionListFunction = getGlobalSettings().get3pConnectionListFunction;
    if (get3pConnectionListFunction) {
      const response = await get3pConnectionListFunction('AWSIoTTwinMaker_Matterport');
      if (response) {
        response.forEach((secret) => {
          if (secret.Name && secret.ARN) {
            connectionList.push({ label: secret.Name, value: secret.ARN });
          }
        });
      }
    }
    setConnectionOptions(connectionList);
  };

  const onUpdated = () => {
    updateSelectedConnectionName();
    getConnectionList();
  };

  useEffect(() => {
    subscribe(onUpdated);
    updateSelectedConnectionName();
    getConnectionList();

    return () => unsubscribe(onUpdated);
  }, []);

  const onConnectionNameChange = useCallback(async (event) => {
    const value = event.detail.selectedOption.value;
    setSelectedConnectionName(value);

    const getSceneInfoFunction = getGlobalSettings().getSceneInfoFunction;
    const updateSceneFunction = getGlobalSettings().updateSceneFunction;
    if (getSceneInfoFunction && updateSceneFunction) {
      let sceneCapabilities: string[] | undefined;
      let sceneMetadata: Record<string, string> | undefined;
      const getSceneresponse = await getSceneInfoFunction();
      if (getSceneresponse) {
        sceneCapabilities = getSceneresponse.capabilities;
        sceneMetadata = getSceneresponse.sceneMetadata;
      }

      if (value === 'n/a') {
        if (sceneCapabilities && sceneCapabilities.includes('MATTERPORT')) {
          sceneCapabilities = sceneCapabilities.filter((capability) => capability !== 'MATTERPORT');
        }

        if (sceneMetadata && sceneMetadata.MATTERPORT_SECRET_ARN) {
          delete sceneMetadata.MATTERPORT_SECRET_ARN;
        }
      } else {
        if (sceneCapabilities) {
          if (!sceneCapabilities.includes('MATTERPORT')) {
            sceneCapabilities.push('MATTERPORT');
          }
        } else {
          sceneCapabilities = ['MATTERPORT'];
        }

        if (sceneMetadata) {
          sceneMetadata.MATTERPORT_SECRET_ARN = value;
        } else {
          sceneMetadata = { MATTERPORT_SECRET_ARN: value };
        }
      }

      updateSceneFunction(sceneCapabilities, sceneMetadata);
    }
  }, []);

  const selectedConnection = () => {
    const selectedOption = connectionOptions.find((t) => t.value === selectedConnectionName);
    if (selectedOption) {
      return {
        label: selectedOption.label,
        value: selectedOption.value,
      };
    }
    return null;
  };

  const onMatterportModelIdChange = useCallback(
    (event) => {
      const value = event.detail.value;
      if (value !== matterportModelId) {
        setMatterportModelId(value);
        setDirty(true);
      }
    },
    [setMatterportModelId, setDirty],
  );

  useEffect(() => {
    if (dirty) {
      setSceneProperty(KnownSceneProperty.MatterportModelId, matterportModelId !== '' ? matterportModelId : undefined);
      setDirty(false);
    }
  }, [matterportModelId]);

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
                selectedOption={selectedConnection()}
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
                href='https://google.com'
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
        <MatterportTagSync />
      </SpaceBetween>
    </React.Fragment>
  );
};
