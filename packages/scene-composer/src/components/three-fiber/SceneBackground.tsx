import { Color, Texture } from 'three';
import { FC, useCallback, useContext, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import { getGlobalSettings } from '../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useStore } from '../../store';
import {
  COMPOSER_FEATURES,
  DEFAULT_SCENE_BACKGROUND_COLOR,
  ISceneBackgroundSetting,
  KnownSceneProperty,
} from '../../interfaces';
import useTwinMakerTextureLoader from '../../hooks/useTwinMakerTextureLoader';
import { ResponseContentType } from '../../three/types';
import { isValidHexCode } from '../../utils/colorUtils';

const SceneBackground: FC = () => {
  const texturesEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Textures];
  const sceneComposerId = useContext(sceneComposerIdContext);
  const scene = useThree((state) => state.scene);
  const sceneBackgroundSettings = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<ISceneBackgroundSetting>(KnownSceneProperty.SceneBackgroundSettings),
  );
  const setSceneProperty = useStore(sceneComposerId)(
    (state) => state.setSceneProperty<ISceneBackgroundSetting | undefined>,
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
      if (sceneBackgroundSettings?.color) {
        const color = isValidHexCode(sceneBackgroundSettings.color)
          ? sceneBackgroundSettings.color
          : DEFAULT_SCENE_BACKGROUND_COLOR;
        scene.background = new Color(color);
        if (color !== sceneBackgroundSettings.color) {
          // something failed validation from scene json/entity load and
          // had to be reverted to default
          setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
            color: color,
            textureUri: sceneBackgroundSettings.textureUri,
          });
        }
      } else {
        scene.background = null;
      }

      //scene.background = sceneBackgroundSettings?.color ? new Color(sceneBackgroundSettings.color) : null;
    }
  }, [scene, sceneBackgroundSettings, loadTexture]);

  return null;
};

export default SceneBackground;
