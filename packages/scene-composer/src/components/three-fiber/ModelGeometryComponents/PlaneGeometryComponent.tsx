import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
import { createPortal, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import useAddWidget from '../../../hooks/useAddWidget';
import useTwinMakerTextureLoader from '../../../hooks/useTwinMakerTextureLoader';
import { IPlaneGeometryComponentInternal, ISceneNodeInternal, useEditorState } from '../../../store';
import { acceleratedRaycasting, getComponentGroupName } from '../../../utils/objectThreeUtils';

export interface PlaneGeometryComponentProps {
  node: ISceneNodeInternal;
  component: IPlaneGeometryComponentInternal;
}

const PlaneGeometryComponent: React.FC<PlaneGeometryComponentProps> = ({
  component,
  node,
}: PlaneGeometryComponentProps) => {
  const meshRef = useRef<THREE.Mesh>();
  const sceneComposerId = useSceneComposerId();
  const { isEditing, addingWidget } = useEditorState(sceneComposerId);
  const { handleAddWidget } = useAddWidget();
  const { loadTextureOnMesh, clearTextureOnMesh } = useTwinMakerTextureLoader();
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const [meshId, setMeshId] = useState('');
  const [dirtyTexture, setDirtyTexture] = useState(false);

  const MAX_CLICK_DISTANCE = 2;

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta <= MAX_CLICK_DISTANCE) {
      if (isEditing() && addingWidget) {
        handleAddWidget(e);
      }
    }
  };

  useFrame(() => {
    if (meshRef.current && meshRef.current.uuid !== meshId) {
      acceleratedRaycasting(meshRef.current);
      setMeshId(meshRef.current.uuid);
    }
    if (meshRef.current?.material && dirtyTexture) {
      if (component.textureUri) {
        loadTextureOnMesh(component.textureUri, meshRef.current);
      }
      setDirtyTexture(false);
    }
  });

  useEffect(() => {
    if (meshRef.current?.material) {
      if (component.textureUri) {
        loadTextureOnMesh(component.textureUri, meshRef.current);
      } else {
        clearTextureOnMesh(meshRef.current);
      }
    } else if (component.textureUri && !!loadTextureOnMesh) {
      setDirtyTexture(true);
    }
  }, [meshId, component.textureUri, loadTextureOnMesh, clearTextureOnMesh]);

  return component.isGroundPlane ? (
    createPortal(
      <group
        name={getComponentGroupName(node.ref, 'PLANE_GEOMETRY')}
        parent={scene}
        position={node.transform.position}
        rotation={new THREE.Euler(...node.transform.rotation, 'XYZ')}
        scale={node.transform.scale}
      >
        <Plane
          args={[component.width, component.height]}
          ref={meshRef}
          onClick={onClick}
          userData={{ nodeRef: node.ref }}
        >
          <meshStandardMaterial color={component.color ? component.color : 'undefined'} side={THREE.DoubleSide} />
        </Plane>
      </group>,
      scene,
      { camera },
    )
  ) : (
    <group name={getComponentGroupName(node.ref, 'PLANE_GEOMETRY')}>
      <Plane args={[component.width, component.height]} ref={meshRef} onClick={onClick}>
        <meshStandardMaterial color={component.color ? component.color : 'undefined'} />
      </Plane>
    </group>
  );
};

export default PlaneGeometryComponent;
