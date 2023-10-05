import { isEmpty } from 'lodash';
import { Alert, Box, Button, Header, SpaceBetween } from '@awsui/components-react';
import React, { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { ISceneNodeInternal, useStore } from '../store';
import { KnownSceneProperty } from '../interfaces';
import {
  checkIfEntityAvailable,
  convertAllNodesToEntities,
  createSceneRootEntity,
  prepareWorkspace,
  staticNodeCount,
} from '../utils/entityModelUtils/sceneUtils';
import { createLayer } from '../utils/entityModelUtils/sceneLayerUtils';
import { LayerType } from '../common/entityModelConstants';
import { getGlobalSettings } from '../common/GlobalSettings';

import CenteredContainer from './CenteredContainer';
import { ConvertingProgress } from './ConvertingProgress';

interface ConvertProgress {
  total: number;
  converted: number;
  failedNodes: ISceneNodeInternal[];
  succeededNodes: ISceneNodeInternal[];
}
interface ConvertResult {
  failedNodes?: ISceneNodeInternal[];
  succeededNodes?: ISceneNodeInternal[];
  errorMessage?: string;
}

const ConvertSceneModal: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const setConvertSceneModalVisibility = useStore(sceneComposerId)((state) => state.setConvertSceneModalVisibility);
  const document = useStore(sceneComposerId)((state) => state.document);

  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);
  const updateSceneNodeInternal = useStore(sceneComposerId)((state) => state.updateSceneNodeInternal);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);

  const sceneRootId = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.SceneRootEntityId),
  );
  const sceneLayerIds = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.LayerIds),
  );

  const { formatMessage } = useIntl();

  const [progress, setProgress] = useState<ConvertProgress | undefined>();
  const [result, setResult] = useState<ConvertResult | undefined>();

  const onClose = useCallback(() => {
    setConvertSceneModalVisibility(false);
    setResult(undefined);
    setProgress(undefined);
  }, [setConvertSceneModalVisibility]);

  const onConfirm = useCallback(async () => {
    try {
      const progress: ConvertProgress = {
        total: staticNodeCount(document.nodeMap),
        converted: 0,
        succeededNodes: [],
        failedNodes: [],
      };
      setProgress(progress);

      let layerId = sceneLayerIds?.at(0);
      let rootId = sceneRootId;
      const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;
      const layerName = `${sceneMetadataModule?.getSceneId()}_Default`;

      if (sceneMetadataModule) {
        // Before backend can create the new default roots, the client side code will
        // create them temporarily here.
        await prepareWorkspace(sceneMetadataModule);

        // Create default layer and default scene root node
        if (!layerId || isEmpty(layerId) || !(await checkIfEntityAvailable(layerId, sceneMetadataModule))) {
          const layer = await createLayer(layerName, LayerType.Relationship);
          layerId = layer?.entityId;
          setSceneProperty(KnownSceneProperty.LayerIds, [layerId]);
        }
        if (!sceneRootId || isEmpty(sceneRootId) || !(await checkIfEntityAvailable(sceneRootId, sceneMetadataModule))) {
          const root = await createSceneRootEntity();
          rootId = root?.entityId;
          setSceneProperty(KnownSceneProperty.SceneRootEntityId, rootId);
        }
      }

      if (rootId && layerId) {
        convertAllNodesToEntities({
          document,
          sceneRootEntityId: rootId,
          layerId,
          getObject3DBySceneNodeRef,
          onSuccess: (convertedNode) => {
            progress.converted++;
            progress.succeededNodes.push(convertedNode);

            if (progress.converted === progress.total) {
              setProgress(undefined);
              setResult({ failedNodes: progress.failedNodes, succeededNodes: progress.succeededNodes });
            } else {
              setProgress(progress);
            }
            updateSceneNodeInternal(convertedNode.ref, convertedNode, false, true);
          },
          onFailure: (convertedNode) => {
            progress.converted++;
            progress.failedNodes.push(convertedNode);

            if (progress.converted === progress.total) {
              setProgress(undefined);
              setResult({ failedNodes: progress.failedNodes, succeededNodes: progress.succeededNodes });
            } else {
              setProgress(progress);
            }
          },
        });
      }
    } catch (e) {
      setProgress(undefined);
      setResult({ errorMessage: (e as Error).message });
    }
  }, [document, sceneLayerIds, sceneRootId, setSceneProperty, updateSceneNodeInternal]);

  return (
    <CenteredContainer
      header={
        <Header variant='h2'>
          {formatMessage({ description: 'modal header text', defaultMessage: 'Convert scene' })}
        </Header>
      }
      footer={
        <Box float='right' padding={{ bottom: 's' }}>
          {result ? (
            <Button data-testid='ok-button' onClick={onClose}>
              {formatMessage({ description: 'button label', defaultMessage: 'Ok' })}
            </Button>
          ) : (
            <SpaceBetween size='s' direction='horizontal'>
              <Button data-testid='cancel-button' onClick={onClose}>
                {formatMessage({ description: 'button label', defaultMessage: 'Cancel' })}
              </Button>

              <Button data-testid='confirm-button' variant='primary' onClick={onConfirm} disabled={!!progress}>
                {formatMessage({ description: 'button label', defaultMessage: 'Confirm' })}
              </Button>
            </SpaceBetween>
          )}
        </Box>
      }
    >
      {!progress && !result && (
        <Alert
          type='warning'
          header={formatMessage({ description: 'alert header text', defaultMessage: 'Converting scene' })}
        >
          {formatMessage({
            description: 'alert body text',
            defaultMessage:
              'Proceeding with this action will permanently change your scene. You cannot undo this action',
          })}
        </Alert>
      )}
      {progress && <ConvertingProgress total={progress.total} converted={progress.converted} />}
      {result &&
        (isEmpty(result.failedNodes) && !result.errorMessage ? (
          <Alert
            type='success'
            header={formatMessage({
              description: 'alert header text',
              defaultMessage: 'Convert to entities successful',
            })}
          >
            {formatMessage({
              description: 'alert body text',
              defaultMessage: 'All nodes have been converted successfully',
            })}
          </Alert>
        ) : (
          <Alert
            type='error'
            header={formatMessage({ description: 'alert header text', defaultMessage: 'Convert to entities failed' })}
          >
            {result.errorMessage && <Box>{result.errorMessage}</Box>}

            {!isEmpty(result.failedNodes) && (
              <Box>
                {formatMessage({ description: 'alert body text', defaultMessage: 'Some node conversion failed:' })}
              </Box>
            )}
            {result.failedNodes &&
              result.failedNodes.map((node) => (
                <Box key={node.ref} padding={{ left: 's' }}>
                  {node.name}
                </Box>
              ))}
          </Alert>
        ))}
    </CenteredContainer>
  );
};

ConvertSceneModal.displayName = 'ConvertSceneModal';

export default ConvertSceneModal;
