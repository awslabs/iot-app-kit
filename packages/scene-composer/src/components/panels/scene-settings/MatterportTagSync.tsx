import React, { useCallback } from 'react';
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
import { createSceneRootEntity } from '../../../utils/entityModelUtils/sceneUtils';

export const MatterportTagSync: React.FC = () => {
  const logger = useLifecycleLogging('MatterportTagSync');
  const intl = useIntl();

  const sceneComposerId = useSceneComposerId();
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
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

  const doSync = useCallback(async () => {
    const layerName = MATTERPORT_TAG_LAYER_PREFIX + matterportModelId;
    let layerId = sceneLayerIds?.at(0);
    let rootId = sceneRootId;

    // Create default layer and default scene root node
    if (dynamicSceneEnabled) {
      if (isEmpty(layerId)) {
        try {
          const layer = await createLayer(layerName, LayerType.Relationship);
          layerId = layer?.entityId;
          setSceneProperty(KnownSceneProperty.LayerIds, [layerId]);
        } catch (e) {
          logger?.error('Create layer entity error', e);
          // TODO: error handling
          return;
        }
      }
      if (isEmpty(sceneRootId)) {
        try {
          const root = await createSceneRootEntity();
          rootId = root?.entityId;
          setSceneProperty(KnownSceneProperty.SceneRootEntityId, rootId);
        } catch (e) {
          logger?.error('Create scene root entity error', e);
          // TODO: error handling
          return;
        }
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
        if (oldTagMap[key]) {
          await handleUpdateMatterportTag(layerId, oldTagMap[key].nodeRef, oldTagMap[key].node, value);
        } else {
          await handleAddMatterportTag(layerId, rootId, key, value);
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

        if (oldTagMap[key]) {
          await handleUpdateMatterportTag(layerId, oldTagMap[key].nodeRef, oldTagMap[key].node, value);
        } else {
          await handleAddMatterportTag(layerId, rootId, key, value);
        }
        delete oldTagMap[key];
      }
    }

    for (const key in oldTagMap) {
      handleRemoveMatterportTag(oldTagMap[key].nodeRef);
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
          <StatusIndicator type='success'>
            {intl.formatMessage({ defaultMessage: 'Tags sync successful', description: 'Status indicator label' })}
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
