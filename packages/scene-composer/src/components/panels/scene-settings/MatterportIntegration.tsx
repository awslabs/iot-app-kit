import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, FormField, Input, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownSceneProperty } from '../../../interfaces';
import { getGlobalSettings, subscribe, unsubscribe } from '../../../common/GlobalSettings';

export const MatterportIntegration: React.FC = () => {
  const log = useLifecycleLogging('MatterportIntegration');
  log?.verbose('Initialize Matterport Integration');

  const intl = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);

  const getSceneProperty = useStore(sceneComposerId)((state) => state.getSceneProperty);
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);

  const [dirty, setDirty] = useState(false);
  const [matterportModelId, setMatterportModelId] = useState(getSceneProperty(KnownSceneProperty.MatterportModelId));

  log?.verbose('Matterport model id: ', matterportModelId);

  const selectedOption = null; // TODO

  const [connectionOptions, setConnectionOptions] = useState<{ label: string; value: string }[]>([]);

  const getConnectionList = async () => {
    const connectionList: { label: string; value: string }[] = [];
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
    getConnectionList();
  };

  useEffect(() => {
    subscribe(onUpdated);
    getConnectionList();

    return () => unsubscribe(onUpdated);
  }, []);

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
      setSceneProperty(KnownSceneProperty.MatterportModelId, matterportModelId);
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
        {connectionOptions.length > 0 && (
          <div>
            <FormField
              label={intl.formatMessage({ description: 'Form Field label', defaultMessage: 'Connection Name' })}
            >
              <Select
                selectedOption={null}
                onChange={(e) => {
                  if (e.detail.selectedOption.value === 'n/a') {
                    // setSceneProperty(KnownSceneProperty.EnvironmentPreset, undefined);
                  } else {
                    // setSceneProperty(KnownSceneProperty.EnvironmentPreset, e.detail.selectedOption.value);
                  }
                }}
                options={connectionOptions}
                selectedAriaLabel={intl.formatMessage({ defaultMessage: 'Selected', description: 'label' })}
                disabled={connectionOptions.length === 0}
                placeholder={intl.formatMessage({
                  defaultMessage: 'Select a secret',
                  description: 'Select a secret placeholder',
                })}
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
          </div>
        )}
        {connectionOptions.length === 0 && (
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
      </SpaceBetween>
    </React.Fragment>
  );
};
