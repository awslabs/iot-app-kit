import { Color } from 'three';
import { FC, useContext, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { useStore } from '../../store';
import { ISceneBackgroundSetting, KnownSceneProperty } from '../../interfaces';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';

const SceneBackground: FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const scene = useThree((state) => state.scene);
  const sceneBackgroundSettings = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<ISceneBackgroundSetting>(KnownSceneProperty.SceneBackgroundSettings),
  );

  useEffect(() => {
    scene.background = sceneBackgroundSettings?.color ? new Color(sceneBackgroundSettings.color) : null;
  }, [scene, sceneBackgroundSettings]);

  return null;
};

export default SceneBackground;
