import { Alert, Box, Button, Header, SpaceBetween } from '@cloudscape-design/components';
import isEmpty from 'lodash-es/isEmpty';
import { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { KnownSceneProperty } from '../../interfaces';
import { type ISceneNodeInternal, accessStore } from '../../store';
import {
  checkIfEntityExists,
  convertAllNodesToEntities,
  createSceneRootEntity,
  prepareWorkspace,
} from '../../utils/entityModelUtils/sceneUtils';
import CenteredContainer from '../CenteredContainer';
import { ConvertingProgress } from '../ConvertingProgress';

interface ConvertProgress {
  total: number;
  converted: number;
  failedNodes: {
    node: ISceneNodeInternal;
    error: string;
  }[];
  succeededNodes: Record<string, ISceneNodeInternal>;
}
interface ConvertResult {
  failedNodes?: {
    node: ISceneNodeInternal;
    error: string;
  }[];
  succeededNodes?: Record<string, ISceneNodeInternal>;
  errorMessage?: string;
}

const ConvertSceneModal: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const setConvertSceneModalVisibility = accessStore(sceneComposerId)((state) => state.setConvertSceneModalVisibility);
  const document = accessStore(sceneComposerId)((state) => state.document);

  const setSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty);
  const updateSceneNodeInternalBatch = accessStore(sceneComposerId)((state) => state.updateSceneNodeInternalBatch);
  const getObject3DBySceneNodeRef = accessStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);

  const sceneRootId = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.SceneRootEntityId),
  );

  const { formatMessage } = useIntl();

  const [progress, setProgress] = useState<ConvertProgress | undefined>();
  const [result, setResult] = useState<ConvertResult | undefined>();

  const onClose = useCallback(() => {
    setConvertSceneModalVisibility(false);
    setResult(undefined);
    setProgress(undefined);
  }, [setConvertSceneModalVisibility]);

  const onResult = useCallback(
    (progressLocal: ConvertProgress) => {
      progressLocal.converted++;

      if (progressLocal.converted === progressLocal.total) {
        setProgress(undefined);
        setResult({ failedNodes: progressLocal.failedNodes, succeededNodes: progressLocal.succeededNodes });
        updateSceneNodeInternalBatch(progressLocal.succeededNodes, false, true);
      } else {
        setProgress({ ...progressLocal });
      }
    },
    [setProgress, setResult, updateSceneNodeInternalBatch],
  );

  const onConfirm = useCallback(async () => {
    try {
      const progressLocal: ConvertProgress = {
        total: Object.keys(document.nodeMap).length,
        converted: 0,
        succeededNodes: {},
        failedNodes: [],
      };
      setProgress(progressLocal);

      let rootId = sceneRootId;
      const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

      if (sceneMetadataModule) {
        // Before backend can create the new default roots, the client side code will
        // create them temporarily here.
        await prepareWorkspace(sceneMetadataModule);

        // Create default scene root node
        const rootEntityExist = rootId && (await checkIfEntityExists(rootId, sceneMetadataModule));
        if (!rootId || isEmpty(rootId) || !rootEntityExist) {
          const root = await createSceneRootEntity();
          rootId = root?.entityId;
          setSceneProperty(KnownSceneProperty.SceneRootEntityId, rootId);
        }
      }

      if (progressLocal.total == 0) {
        // Bump up total to one because onResult has success branch
        // on the condition of converted+++ == total
        onResult({ ...progressLocal, total: 1 });
      } else if (rootId) {
        await convertAllNodesToEntities({
          document,
          sceneRootEntityId: rootId,
          // @ts-expect-error type mismatch after update
          getObject3DBySceneNodeRef,
          onSuccess: (convertedNode) => {
            progressLocal.succeededNodes[convertedNode.ref] = convertedNode;
            onResult(progressLocal);
          },
          onFailure: (convertedNode, error) => {
            progressLocal.failedNodes.push({ node: convertedNode, error: error.message });
            onResult(progressLocal);
          },
        });
      }
    } catch (e) {
      setProgress(undefined);
      setResult({ errorMessage: (e as Error).message });
    }
  }, [document, sceneRootId, setSceneProperty, updateSceneNodeInternalBatch, setProgress]);

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
              result.failedNodes.map(({ node, error }) => (
                <Box key={node.ref} padding={{ left: 's' }}>
                  {node.name} ({error})
                </Box>
              ))}
          </Alert>
        ))}
    </CenteredContainer>
  );
};

ConvertSceneModal.displayName = 'ConvertSceneModal';

export default ConvertSceneModal;
