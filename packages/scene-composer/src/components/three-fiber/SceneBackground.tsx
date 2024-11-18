import { Color, type Texture } from 'three';
import { type FC, useCallback, useContext, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import { getGlobalSettings } from '../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { accessStore } from '../../store';
import { COMPOSER_FEATURES, type ISceneBackgroundSetting, KnownSceneProperty } from '../../interfaces';
import useTwinMakerTextureLoader from '../../hooks/useTwinMakerTextureLoader';
import { type ResponseContentType } from '../../three/types';

const SceneBackground: FC = () => {
  const texturesEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Textures];
  const sceneComposerId = useContext(sceneComposerIdContext);
  const scene = useThree((state) => state.scene);
  const sceneBackgroundSettings = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<ISceneBackgroundSetting>(KnownSceneProperty.SceneBackgroundSettings),
  );
  const { loadTexture } = useTwinMakerTextureLoader({ imageOrientation: 'flipY' });

  const textureRef = useRef<Texture | null>(null);

  const setBackgroundCallback = useCallback(
    (result: ResponseContentType) => {
      const oldTexture = textureRef.current;
      textureRef.current = result as unknown as Texture;
      scene.background = textureRef.current ? textureRef.current : null;
      if (oldTexture) {
        oldTexture.dispose();
      }
    },
    [scene],
  );

  useEffect(() => {
    if (texturesEnabled && sceneBackgroundSettings?.textureUri) {
      loadTexture(sceneBackgroundSettings.textureUri, setBackgroundCallback);
    } else {
      scene.background = sceneBackgroundSettings?.color ? new Color(sceneBackgroundSettings.color) : null;
    }
  }, [scene, sceneBackgroundSettings, loadTexture]);

  return null;
};

export default SceneBackground;
