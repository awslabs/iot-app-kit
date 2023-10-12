import * as THREE from 'three';
import { FC, useContext, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { useStore } from '../../store';
import { IFogSettings, KnownSceneProperty } from '../../interfaces';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';

const Fog: FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const scene = useThree((state) => state.scene);
  const fogSettings = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<IFogSettings>(KnownSceneProperty.FogSettings),
  );

  useEffect(() => {
    scene.fog =
      fogSettings && fogSettings.colorHex
        ? new THREE.Fog(fogSettings.colorHex, fogSettings.near, fogSettings.far)
        : null;
  }, [scene, fogSettings]);

  return null;
};

export default Fog;
