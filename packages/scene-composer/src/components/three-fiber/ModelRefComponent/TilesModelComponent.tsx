import React from 'react';
import { useFrame } from '@react-three/fiber';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { IModelRefComponentInternal, ISceneNodeInternal, useStore } from '../../../store';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';

import { useTiles } from './TilesLoader';

interface TilesModelProps {
  node: ISceneNodeInternal;
  component: IModelRefComponentInternal;
}

export const TilesModelComponent: React.FC<TilesModelProps> = ({ node, component }: TilesModelProps) => {
  const sceneComposerId = useSceneComposerId();
  useLifecycleLogging('TilesModelComponent');
  const uriModifier = useStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);

  // TODO: tilesRenderer holds "group" and it'll load tiles and B3DM/I3DM files dynanimcally, so we don't need
  //       to clone the model like what we did in GLTFModelComponent. However, if we found this assumption is
  //       wrong in the future, let's optimize from here.
  const tilesRenderer = useTiles(component.uri, uriModifier);
  useFrame(() => {
    tilesRenderer.update();
  });

  return (
    <group name={getComponentGroupName(node.ref, 'TILES_MODEL')} dispose={null}>
      <primitive object={tilesRenderer.group} />
    </group>
  );
};
