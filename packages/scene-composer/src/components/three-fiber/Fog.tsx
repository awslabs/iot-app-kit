import * as THREE from 'three';
import { FC, useContext, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { accessStore } from '../../store';
import { IFogSettings, KnownSceneProperty } from '../../interfaces';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';

const Fog: FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const scene = useThree((state) => state.scene);
  const fogSettings = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<IFogSettings>(KnownSceneProperty.FogSettings),
  );

  useEffect(() => {
    scene.fog =
      fogSettings && fogSettings.color ? new THREE.Fog(fogSettings.color, fogSettings.near, fogSettings.far) : null;
  }, [scene, fogSettings]);

  return null;
};

export default Fog;
