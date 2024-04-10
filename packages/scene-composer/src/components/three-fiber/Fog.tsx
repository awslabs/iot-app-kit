import * as THREE from 'three';
import { FC, useContext, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { useStore } from '../../store';
import {
  DEFAULT_FOG_COLOR,
  DEFAULT_FOG_FAR,
  DEFAULT_FOG_NEAR,
  IFogSettings,
  KnownSceneProperty,
} from '../../interfaces';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { isValidHexCode } from '../../utils/colorUtils';

const Fog: FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const scene = useThree((state) => state.scene);
  const fogSettings = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<IFogSettings>(KnownSceneProperty.FogSettings),
  );
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<IFogSettings | undefined>);

  useEffect(() => {
    if (fogSettings?.color) {
      const color = isValidHexCode(fogSettings.color) ? fogSettings.color : DEFAULT_FOG_COLOR;
      const near = fogSettings.near && fogSettings.near > 0 ? fogSettings.near : DEFAULT_FOG_NEAR;
      const far = fogSettings.far && fogSettings.far > 0 ? fogSettings.far : DEFAULT_FOG_FAR;
      scene.fog = new THREE.Fog(color, near, far);
      if (color !== fogSettings.color || near !== fogSettings.near || far !== fogSettings.far) {
        // something failed validation from scene json/entity load and
        // had to be reverted to default
        setSceneProperty(KnownSceneProperty.FogSettings, {
          color: color,
          near: near,
          far: far,
        });
      }
    } else {
      scene.fog = null;
    }
    // scene.fog =
    //   fogSettings && fogSettings.color ? new THREE.Fog(fogSettings.color, fogSettings.near, fogSettings.far) : null;
  }, [scene, fogSettings]);

  return null;
};

export default Fog;
