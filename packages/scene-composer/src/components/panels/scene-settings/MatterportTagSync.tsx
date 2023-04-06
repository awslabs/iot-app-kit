import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Button, Popover, StatusIndicator } from '@awsui/components-react';

import { KnownComponentType } from '../../../interfaces';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { ISceneNodeInternal, useStore } from '../../../store';
import useMatterportTags from '../../../hooks/useMatterportTags';
import useMatterportObserver from '../../../hooks/useMatterportObserver';

export const MatterportTagSync: React.FC = () => {
  useLifecycleLogging('MatterportTagSync');
  const intl = useIntl();

  const sceneComposerId = useSceneComposerId();
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);

  const { handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag } = useMatterportTags();
  const { mattertagObserver, tagObserver } = useMatterportObserver();

  const doSync = useCallback(() => {
    const mattertags = mattertagObserver.getMattertags(); // Matterport tags v1
    const tags = tagObserver.getTags(); // Matterport tags v2

    const tagRecords = getComponentRefByType(KnownComponentType.Tag);
    const oldTagMap: Record<string, { nodeRef: string; node: ISceneNodeInternal }> = {};
    for (const key in tagRecords) {
      const node = getSceneNodeByRef(key);
      if (node?.properties.matterportId) {
        oldTagMap[node.properties.matterportId] = { nodeRef: key, node: node };
      }
    }

    // Process Matterport tags v2
    if (tags) {
      for (const [key, value] of tags) {
        if (oldTagMap[key]) {
          handleUpdateMatterportTag(oldTagMap[key].nodeRef, oldTagMap[key].node, value);
        } else {
          handleAddMatterportTag(key, value);
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
          handleUpdateMatterportTag(oldTagMap[key].nodeRef, oldTagMap[key].node, value);
        } else {
          handleAddMatterportTag(key, value);
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
