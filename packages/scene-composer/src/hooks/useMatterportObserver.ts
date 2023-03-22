import { useEffect, useState } from 'react';
import { MpSdk } from '@matterport/webcomponent';

import { getMatterportSdk } from '../common/GlobalSettings';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { MattertagObserver, TagObserver } from '../utils/matterportTagUtils';

const useMatterportObserver = (): {
  mattertagObserver: MattertagObserver;
  tagObserver: TagObserver;
} => {
  const sceneComposerId = useSceneComposerId();
  const matterportSdk = getMatterportSdk(sceneComposerId); //

  const [mattertagObserver] = useState<MattertagObserver>(new MattertagObserver());
  const [tagObserver] = useState<TagObserver>(new TagObserver());

  useEffect(() => {
    let mattertagSubscription: MpSdk.ISubscription | undefined = undefined;
    let tagSubscription: MpSdk.ISubscription | undefined = undefined;
    if (matterportSdk) {
      if (matterportSdk.Mattertag) {
        mattertagSubscription = matterportSdk.Mattertag.data.subscribe(mattertagObserver);
      }
      if (matterportSdk.Tag) {
        tagSubscription = matterportSdk.Tag.data.subscribe(tagObserver);
      }
    }

    return () => {
      if (mattertagSubscription) {
        mattertagSubscription.cancel();
      }
      if (tagSubscription) {
        tagSubscription.cancel();
      }
    };
  }, [matterportSdk]);

  return { mattertagObserver, tagObserver };
};

export default useMatterportObserver;
