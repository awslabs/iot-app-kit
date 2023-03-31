import { useMemo } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IOverlaySettings, KnownComponentType } from '../interfaces';
import { Component } from '../models/SceneModels';
import { useStore, useViewOptionState } from '../store';
import { componentSettingsSelector } from '../utils/componentSettingsUtils';

const useOverlayVisible = (subType: Component.DataOverlaySubType): boolean => {
  const sceneComposerId = useSceneComposerId();
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());
  const documentSettings: IOverlaySettings = useStore(sceneComposerId)(
    (state) => componentSettingsSelector(state, KnownComponentType.DataOverlay) as IOverlaySettings,
  );
  const componentVisible = useViewOptionState(sceneComposerId).componentVisibilities[subType];
  const visible: boolean = useMemo(() => {
    if (subType === Component.DataOverlaySubType.TextAnnotation || isViewing) {
      return !!componentVisible;
    }

    return !!documentSettings.overlayPanelVisible;
  }, [isViewing, documentSettings, componentVisible]);

  return visible;
};

export default useOverlayVisible;
