import { useMemo } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { ITagSettings, KnownComponentType } from '../interfaces';
import { useStore, useViewOptionState } from '../store';
import { componentSettingsSelector } from '../utils/componentSettingsUtils';

const useTagSettings = () => {
  const sceneComposerId = useSceneComposerId();
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());
  const documentTagSettings: ITagSettings = useStore(sceneComposerId)((state) =>
    componentSettingsSelector(state, KnownComponentType.Tag),
  );
  const viewingTagSettings: ITagSettings | undefined = useViewOptionState(sceneComposerId).tagSettings;
  const tagSettings: ITagSettings = useMemo(() => {
    if (isViewing && viewingTagSettings) {
      return viewingTagSettings;
    } else {
      return documentTagSettings;
    }
  }, [isViewing, documentTagSettings, viewingTagSettings]);

  return tagSettings;
};

export default useTagSettings;
