import { useMemo } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { type ITagSettings, KnownComponentType } from '../interfaces';
import { accessStore, useViewOptionState } from '../store';
import { componentSettingsSelector } from '../utils/componentSettingsUtils';

const useTagSettings = (): ITagSettings => {
  const sceneComposerId = useSceneComposerId();
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());
  const documentTagSettings: ITagSettings = accessStore(sceneComposerId)(
    (state) => componentSettingsSelector(state, KnownComponentType.Tag) as ITagSettings,
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
