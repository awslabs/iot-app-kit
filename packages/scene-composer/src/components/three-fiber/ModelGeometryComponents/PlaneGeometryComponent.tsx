import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Plane } from '@react-three/drei';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import useAddWidget from '../../../hooks/useAddWidget';
import { IPlaneGeometryComponentInternal, ISceneNodeInternal, useEditorState } from '../../../store';
import { acceleratedRaycasting, getComponentGroupName } from '../../../utils/objectThreeUtils';

interface PlaneGeometryComponentProps {
  node: ISceneNodeInternal;
  component: IPlaneGeometryComponentInternal;
}

const PlaneGeometryComponent: React.FC<PlaneGeometryComponentProps> = ({
  component,
  node,
}: PlaneGeometryComponentProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const sceneComposerId = useSceneComposerId();
  const { isEditing, addingWidget } = useEditorState(sceneComposerId);
  const { handleAddWidget } = useAddWidget();
  const MAX_CLICK_DISTANCE = 2;

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    console.log('click triggered, ', e);
    if (e.delta <= MAX_CLICK_DISTANCE) {
      if (isEditing() && addingWidget) {
        handleAddWidget(e);
      }
    }
  };

  useEffect(() => {
    if (meshRef.current) {
      acceleratedRaycasting(meshRef.current);
    }
  }, [meshRef.current]);

  return (
    <group name={getComponentGroupName(node.ref, 'PLANE_GEOMETRY')}>
      <Plane args={[component.width, component.height]} ref={meshRef} onClick={onClick}>
        <meshBasicMaterial color={component.color ? component.color : '#CCCCCC'} side={THREE.DoubleSide} />
      </Plane>
    </group>
  );
};

export default PlaneGeometryComponent;
