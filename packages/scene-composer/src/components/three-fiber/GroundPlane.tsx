import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';

import { DEFAULT_GROUND_PLANE_COLOR, IGroundPlaneSettings, KnownSceneProperty } from '../../interfaces';
import { useSceneComposerId } from '../../common/sceneComposerIdContext';
import { MAX_CLICK_DISTANCE } from '../../common/constants';
import useAddWidget from '../../hooks/useAddWidget';
import useMatterportViewer from '../../hooks/useMatterportViewer';
import useTwinMakerTextureLoader from '../../hooks/useTwinMakerTextureLoader';
import { useEditorState, useStore } from '../../store';
import { acceleratedRaycasting } from '../../utils/objectThreeUtils';
import { isValidHexCode } from '../../utils/colorUtils';

const GroundPlane: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>();
  const sceneComposerId = useSceneComposerId();
  const { isEditing, addingWidget } = useEditorState(sceneComposerId);
  const { handleAddWidget } = useAddWidget();
  const { loadTextureOnMesh, clearTextureOnMesh } = useTwinMakerTextureLoader();
  const setSceneProperty = useStore(sceneComposerId)(
    (state) => state.setSceneProperty<IGroundPlaneSettings | undefined>,
  );
  const groundPlaneSettings = useStore(sceneComposerId)((state) =>
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

  // valid settings
  useEffect(() => {
    if (groundPlaneSettings) {
      const color = groundPlaneSettings.color
        ? isValidHexCode(groundPlaneSettings.color)
          ? groundPlaneSettings.color
          : DEFAULT_GROUND_PLANE_COLOR
        : undefined;
      const opacity =
        groundPlaneSettings.opacity >= 0 && groundPlaneSettings.opacity <= 1 ? groundPlaneSettings.opacity : 0;
      const textureUri = groundPlaneSettings.textureUri;
      if (
        color !== groundPlaneSettings?.color ||
        opacity !== groundPlaneSettings.opacity ||
        textureUri !== groundPlaneSettings.textureUri
      ) {
        setSceneProperty(KnownSceneProperty.GroundPlaneSettings, {
          color: color,
          opacity: opacity,
          textureUri: textureUri,
        });
      }
    }
  }, [groundPlaneSettings]);

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
