import { Plane } from '@react-three/drei';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { MAX_CLICK_DISTANCE } from '../../common/constants';
import { useSceneComposerId } from '../../common/sceneComposerIdContext';
import useAddWidget from '../../hooks/useAddWidget';
import useMatterportViewer from '../../hooks/useMatterportViewer';
import useTwinMakerTextureLoader from '../../hooks/useTwinMakerTextureLoader';
import { type IGroundPlaneSettings, KnownSceneProperty } from '../../interfaces';
import { accessStore, useEditorState } from '../../store';
import { acceleratedRaycasting } from '../../utils/objectThreeUtils';

const GroundPlane: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>();
  const sceneComposerId = useSceneComposerId();
  const { isEditing, addingWidget } = useEditorState(sceneComposerId);
  const { handleAddWidget } = useAddWidget();
  const { loadTextureOnMesh, clearTextureOnMesh } = useTwinMakerTextureLoader();
  const groundPlaneSettings = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<IGroundPlaneSettings>(KnownSceneProperty.GroundPlaneSettings),
  );
  const { enableMatterportViewer } = useMatterportViewer();

  const [meshId, setMeshId] = useState('');
  const [dirtyTexture, setDirtyTexture] = useState(false);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta <= MAX_CLICK_DISTANCE && isEditing() && addingWidget) {
      handleAddWidget(e);
    }
  };

  useFrame(() => {
    if (meshRef.current && meshRef.current.uuid !== meshId) {
      acceleratedRaycasting(meshRef.current);
      setMeshId(meshRef.current.uuid);
    }
    if (meshRef.current?.material && dirtyTexture) {
      if (groundPlaneSettings?.textureUri) {
        loadTextureOnMesh(groundPlaneSettings.textureUri, meshRef.current);
      }
      setDirtyTexture(false);
    }
  });

  useEffect(() => {
    if (meshRef.current?.material) {
      if (groundPlaneSettings?.textureUri) {
        loadTextureOnMesh(groundPlaneSettings.textureUri, meshRef.current);
      } else {
        clearTextureOnMesh(meshRef.current);
      }
    } else if (groundPlaneSettings?.textureUri && !!loadTextureOnMesh) {
      setDirtyTexture(true);
    }
  }, [meshRef.current, groundPlaneSettings?.textureUri, loadTextureOnMesh, clearTextureOnMesh]);

  return groundPlaneSettings ? (
    <Plane
      name='Ground'
      rotation={[THREE.MathUtils.degToRad(270), 0, 0]}
      args={[1000, 1000]}
      ref={meshRef}
      onClick={onClick}
      renderOrder={enableMatterportViewer ? 1 : undefined}
    >
      <meshStandardMaterial
        color={groundPlaneSettings.color ? groundPlaneSettings.color : undefined}
        side={THREE.DoubleSide}
        transparent={groundPlaneSettings.opacity !== 1 ? true : false}
        opacity={groundPlaneSettings.opacity}
      />
    </Plane>
  ) : isEditing() ? (
    <Plane
      name='Ground'
      rotation={[THREE.MathUtils.degToRad(270), 0, 0]}
      args={[1000, 1000]}
      ref={meshRef}
      onClick={onClick}
      renderOrder={enableMatterportViewer ? 1 : undefined}
    >
      <meshBasicMaterial transparent={true} opacity={0} side={THREE.DoubleSide} />
    </Plane>
  ) : null;
};

export default GroundPlane;
