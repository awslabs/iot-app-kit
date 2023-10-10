import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Popover, StatusIndicator } from '@awsui/components-react';
import { isEmpty } from 'lodash';

import { KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { ISceneNodeInternal, useStore } from '../../../store';
import useMatterportTags from '../../../hooks/useMatterportTags';
import useMatterportObserver from '../../../hooks/useMatterportObserver';
import { LayerType, MATTERPORT_TAG_LAYER_PREFIX } from '../../../common/entityModelConstants';
import { createLayer } from '../../../utils/entityModelUtils/sceneLayerUtils';
import useDynamicScene from '../../../hooks/useDynamicScene';
import {
  checkIfEntityAvailable,
  createSceneRootEntity,
  prepareWorkspace,
} from '../../../utils/entityModelUtils/sceneUtils';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { DisplayMessageCategory, IDisplayMessage } from '../../../store/internalInterfaces';

export const MatterportTagSync: React.FC = () => {
  const logger = useLifecycleLogging('MatterportTagSync');
  const intl = useIntl();

  const sceneComposerId = useSceneComposerId();
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const addMessages = useStore(sceneComposerId)((state) => state.addMessages);

  const matterportModelId = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.MatterportModelId),
  );
  const sceneRootId = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.SceneRootEntityId),
  );
  const sceneLayerIds = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.LayerIds),
  );
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);
  const dynamicSceneEnabled = useDynamicScene();

  const { handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag } = useMatterportTags();
  const { mattertagObserver, tagObserver } = useMatterportObserver();
  const [syncTagStatus, setSyncTagStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const doSync = useCallback(async () => {
    setSyncTagStatus('loading');
    const errorMessages: IDisplayMessage[] = [];

    try {
      const layerName = MATTERPORT_TAG_LAYER_PREFIX + matterportModelId;
      let layerId = sceneLayerIds?.at(0);
      let rootId = sceneRootId;
      const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

      if (dynamicSceneEnabled && sceneMetadataModule) {
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

      const mattertags = mattertagObserver.getMattertags(); // Matterport tags v1
      const tags = tagObserver.getTags(); // Matterport tags v2

      const tagRecords = getComponentRefByType(KnownComponentType.Tag);
      const oldTagMap: Record<string, { nodeRef: string; node: ISceneNodeInternal }> = {};
      for (const key in tagRecords) {
        const node = getSceneNodeByRef(key);
        if (node?.properties.matterportId) {
          oldTagMap[node.properties.matterportId as string] = { nodeRef: key, node: node };
        }
      }

      // Process Matterport tags v2
      if (tags) {
        for (const [key, value] of tags) {
          try {
            if (oldTagMap[key]) {
              await handleUpdateMatterportTag({
                layerId,
                sceneRootId: rootId,
                ref: oldTagMap[key].nodeRef,
                node: oldTagMap[key].node,
                item: value,
              });
            } else {
              await handleAddMatterportTag({ layerId, sceneRootId: rootId, id: key, item: value });
            }
          } catch (e) {
            errorMessages.push({
              category: DisplayMessageCategory.Warning,
              messageText: `Sync tag ${key} failed with error: ${(e as Error).message}`,
            });
          }
          delete oldTagMap[key];
        }
      }

      // Process Matterport tags v1
      if (mattertags) {
        // matterport dictionary is a customer matterport type that doesn't inherit other javascript properties like
        // enumerable so use this exact iterable for it only
        for (const [key, value] of mattertags) {
          // Process only those tags which are not already taken care by v2 tags version
          if (tags && tags[key]) {
            continue;
          }

          try {
            if (oldTagMap[key]) {
              await handleUpdateMatterportTag({
                layerId,
                sceneRootId: rootId,
                ref: oldTagMap[key].nodeRef,
                node: oldTagMap[key].node,
                item: value,
              });
            } else {
              await handleAddMatterportTag({ layerId, sceneRootId: rootId, id: key, item: value });
            }
          } catch (e) {
            errorMessages.push({
              category: DisplayMessageCategory.Warning,
              messageText: `Sync tag ${key} failed with error: ${(e as Error).message}`,
            });
          }

          delete oldTagMap[key];
        }
      }

      for (const key in oldTagMap) {
        await handleRemoveMatterportTag(oldTagMap[key].nodeRef);
      }
    } catch (e) {
      logger?.error(String(e));
      setSyncTagStatus('error');
      errorMessages.push({
        category: DisplayMessageCategory.Warning,
        messageText: `Sync tags failed with error: ${(e as Error).message}`,
      });
    }

    if (isEmpty(errorMessages)) {
      setSyncTagStatus('success');
    } else {
      setSyncTagStatus('error');
      addMessages(errorMessages);
    }
  }, [
    getSceneNodeByRef,
    mattertagObserver,
    tagObserver,
    matterportModelId,
    sceneLayerIds,
    sceneRootId,
    dynamicSceneEnabled,
    handleAddMatterportTag,
    handleUpdateMatterportTag,
    handleRemoveMatterportTag,
  ]);

  return (
    <React.Fragment>
      <Popover
        dismissButton={false}
        position='top'
        size='small'
        triggerType='custom'
        content={
          <StatusIndicator type={syncTagStatus} data-testid='sync-button-status'>
            {syncTagStatus === 'success'
              ? intl.formatMessage({ defaultMessage: 'Tags sync successful', description: 'Status indicator label' })
              : syncTagStatus === 'error'
              ? intl.formatMessage({ defaultMessage: 'Tags sync failed', description: 'Status indicator label' })
              : intl.formatMessage({ defaultMessage: 'Syncing tags', description: 'Status indicator label' })}
          </StatusIndicator>
        }
      >
        <Button data-testid='matterport-tag-sync-button' onClick={doSync}>
          {intl.formatMessage({ defaultMessage: 'Sync Matterport Tags', description: 'matterport tag sync button' })}
        </Button>
      </Popover>
    </React.Fragment>
  );
};
