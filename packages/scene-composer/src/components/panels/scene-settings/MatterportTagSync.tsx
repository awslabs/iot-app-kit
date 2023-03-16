import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, } from '@awsui/components-react';
import { KnownComponentType } from '../../../interfaces';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { ISceneNodeInternal, useStore } from '../../../store';
import { MpSdk } from '@matterport/webcomponent';
import { MattertagObserver, TagObserver} from '../../../utils/matterportTagUtils';
import useMatterportTags from '../../../hooks/useMatterportTags';

export const MatterportTagSync: React.FC = () => {
  useLifecycleLogging('MatterportTagSync');
  const intl = useIntl();

  const sceneComposerId = useSceneComposerId();
  const matterportSdk = useStore(sceneComposerId)((state) => state.matterportSdk)
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);

  const [mattertagObserver] = useState<MattertagObserver>(new MattertagObserver());
  const [tagObserver] = useState<TagObserver>(new TagObserver());
  const {handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag} = useMatterportTags();

  useEffect(() => {
    let mattertagSubscription: MpSdk.ISubscription | undefined = undefined;
    let tagSubscription: MpSdk.ISubscription | undefined = undefined;
    if(matterportSdk) {
      if(matterportSdk.Mattertag) {
        mattertagSubscription = matterportSdk.Mattertag.data.subscribe(mattertagObserver);
      }
      if(matterportSdk.Tag) {
        tagSubscription = matterportSdk.Tag.data.subscribe(tagObserver);
      }
    }

    return () => {
      if(mattertagSubscription) {
        mattertagSubscription.cancel();
      }
      if(tagSubscription) {
        tagSubscription.cancel();
      }
    };
  },[matterportSdk]);

  const doSync = useCallback(() => {
    const mattertags = mattertagObserver.getMattertags();
    const tags = tagObserver.getTags();

    const tagRecords = getComponentRefByType(KnownComponentType.Tag);
    const oldTagMap: Record<string, {nodeRef: string, node: ISceneNodeInternal}> = {};
    for (const key in tagRecords) {
      const node = getSceneNodeByRef(key);
      if (node?.properties.matterportId) {
        oldTagMap[node.properties.matterportId] = {nodeRef: key, node: node};
      } 
    }

    if(mattertags) {
      // matterport dictionary is a customer matterport type that doesn't inherit other javascript properties like 
      // enumerable so use this exact iterable for it only
      for (const [key, value] of mattertags) {
        if (oldTagMap[key]) {
          handleUpdateMatterportTag(oldTagMap[key].nodeRef, oldTagMap[key].node, value);
        } else {
          handleAddMatterportTag(key, value);
        }
        delete oldTagMap[key];
      }
    }

    if(tags) {
      for (const [key, value] of tags) {
        if (oldTagMap[key]) {
          handleUpdateMatterportTag(oldTagMap[key].nodeRef, oldTagMap[key].node, value);
        } else {
          handleAddMatterportTag(key, value);
        }
        delete oldTagMap[key];
      }
    }
    
    for (const key in oldTagMap) {
      console.log('removing: ', key);
      handleRemoveMatterportTag(oldTagMap[key].nodeRef);
    }
},[matterportSdk, handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag]);

  return (
    <React.Fragment>
      <Button onClick={doSync}>
        {intl.formatMessage({ defaultMessage: 'Sync Matterport Tags', description: 'matterport tag sync button' })}
      </Button>
    </React.Fragment>
  );
}