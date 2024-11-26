import { Box, Button, FormField, Input, Select, SpaceBetween } from '@cloudscape-design/components';
import isEmpty from 'lodash-es/isEmpty';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { getGlobalSettings, subscribe, unsubscribe } from '../../../common/GlobalSettings';
import { MATTERPORT_ERROR } from '../../../common/constants';
import { OPTIONS_PLACEHOLDER_VALUE } from '../../../common/internalConstants';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { SceneMetadataMapKeys } from '../../../common/sceneModelConstants';
import { KnownSceneProperty } from '../../../interfaces';
import { accessStore, useViewOptionState } from '../../../store';
import { DisplayMessageCategory } from '../../../store/internalInterfaces';
import {
  getMatterportConnectionList,
  getUpdatedSceneInfoForConnection,
} from '../../../utils/matterportIntegrationUtils';
import { MatterportTagSync } from './MatterportTagSync';

export const MatterportIntegration: React.FC = () => {
  const intl = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { setSceneProperty, addMessages } = accessStore(sceneComposerId)((state) => state);

  const matterportModelId = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.MatterportModelId),
  );
  const [matterportModelIdInternal, setMatterportModelIdInternal] = useState(matterportModelId);

  const [connectionOptions, setConnectionOptions] = useState<{ label: string; value: string }[]>([
    {
      label: intl.formatMessage({
        defaultMessage: 'Select a connection',
        description: 'Select a connection placeholder',
      }),
      value: OPTIONS_PLACEHOLDER_VALUE,
    },
  ]);
  const [selectedConnectionName, setSelectedConnectionName] = useState<string>();
  const [isValidConnection, setIsValidConnection] = useState(false);
  const { setConnectionNameForMatterportViewer } = useViewOptionState(sceneComposerId);
  const twinMakerSceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  const updateSelectedConnectionName = useCallback(async () => {
    if (twinMakerSceneMetadataModule) {
      const getSceneResponse = await twinMakerSceneMetadataModule.getSceneInfo();
      if (
        getSceneResponse &&
        getSceneResponse.sceneMetadata &&
        getSceneResponse.sceneMetadata[SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]
      ) {
        const isValidConnection = !(getSceneResponse.error && getSceneResponse.error.code === MATTERPORT_ERROR);
        setIsValidConnection(isValidConnection);
        setSelectedConnectionName(getSceneResponse.sceneMetadata[SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]);
      } else {
        setIsValidConnection(false);
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

  // Update internal when matterportModelId in store is changed
  useEffect(() => {
    if (matterportModelId !== matterportModelIdInternal) {
      setMatterportModelIdInternal(matterportModelId);
    }
  }, [matterportModelId]);

  const onConnectionNameChange = useCallback(
    async (event) => {
      const newConnection = event.detail.selectedOption.value;
      if (twinMakerSceneMetadataModule) {
        const updatedSceneInfo = await getUpdatedSceneInfoForConnection(newConnection, twinMakerSceneMetadataModule);
        twinMakerSceneMetadataModule
          .updateSceneInfo(updatedSceneInfo)
          .then(async () => {
            setSelectedConnectionName(newConnection);
            const getSceneResponse = await twinMakerSceneMetadataModule.getSceneInfo();
            const isValidConnection = !(getSceneResponse.error && getSceneResponse.error.code === MATTERPORT_ERROR);
            setIsValidConnection(isValidConnection);
            setConnectionNameForMatterportViewer(isValidConnection ? newConnection : undefined);
            if (!isValidConnection && getSceneResponse.error && getSceneResponse.error.message) {
              addMessages([{ category: DisplayMessageCategory.Warning, messageText: getSceneResponse.error.message }]);
            }
          })
          .catch((error) => {
            addMessages([{ category: DisplayMessageCategory.Warning, messageText: error.message }]);
          });
      }
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
    if (matterportModelId !== matterportModelIdInternal) {
      setSceneProperty(
        KnownSceneProperty.MatterportModelId,
        matterportModelIdInternal !== '' ? matterportModelIdInternal : undefined,
      );
    }
  }, [matterportModelIdInternal]);

  const onMatterportModelIdChange = useCallback(
    (event) => {
      const value = event.detail.value;
      if (value !== matterportModelIdInternal) {
        setMatterportModelIdInternal(value);
      }
    },
    [matterportModelIdInternal],
  );

  const enableMatterportViewer =
    !isEmpty(matterportModelIdInternal) &&
    !isEmpty(selectedConnectionName) &&
    selectedConnectionName !== OPTIONS_PLACEHOLDER_VALUE &&
    isValidConnection;

  return (
    <>
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
          <>
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
                value={matterportModelIdInternal || ''}
                type='text'
                onBlur={onInputBlur}
                onChange={onMatterportModelIdChange}
                placeholder={intl.formatMessage({
                  defaultMessage: 'Enter your Matterport model id',
                  description: 'Enter your Matterport model id placeholder',
                })}
              />
            </FormField>
          </>
        )}
        {connectionOptions.length <= 1 && (
          <div style={{ textAlign: 'center' }}>
            <SpaceBetween size='xl'>
              <Box fontWeight='bold' textAlign='center'>
                {intl.formatMessage({ description: 'Desction label', defaultMessage: 'No Connections' })}
              </Box>
              <Button
                ariaLabel='Learn more (opens new tab)'
                href='https://docs.aws.amazon.com/iot-twinmaker/latest/guide/tm-matterport-integration.html'
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
    </>
  );
};
