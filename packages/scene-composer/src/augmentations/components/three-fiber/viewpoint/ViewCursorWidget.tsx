import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Mesh as THREEMesh, Object3D as THREEObject3D, Vector3 as THREEVector3 } from 'three';
import { SVGLoader } from 'three-stdlib';

import { convertSvgToMesh } from '../../../../utils/svgUtils';
import { getIntersectionTransform } from '../../../../utils/raycastUtils';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../../store';
import { ViewCursorEditIcon, ViewCursorMoveIcon } from '../../../../assets';

export const ViewCursorWidget = () => {
  const ref = useRef<THREEObject3D>(null);
  const { gl } = useThree();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { addingWidget, cursorVisible, cursorStyle, setAddingWidget, setCursorVisible, setCursorStyle } =
    useEditorState(sceneComposerId);
  const svg = cursorStyle === 'edit' ? ViewCursorEditIcon : ViewCursorMoveIcon;
  const data = useLoader(SVGLoader, svg.dataUri);

  const esc = useCallback(() => {
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !!addingWidget) {
        setAddingWidget(undefined);
      }
    });
    return window.removeEventListener('keyup', setAddingWidget as any);
  }, [addingWidget]);

  const shape = useMemo(() => {
    return convertSvgToMesh(data);
  }, [data]);

  /* istanbul ignore next */
  useFrame(({ raycaster, scene }) => {
    const sceneMeshes: THREEObject3D[] = [];
    scene.traverse((child) => {
      return shape.id !== child.id && (child as THREEMesh).isMesh && child.type !== 'TransformControlsPlane'
        ? sceneMeshes.push(child as THREEMesh)
        : null;
    });
    const intersects = raycaster.intersectObjects(sceneMeshes, false);
    if (intersects.length) {
      const n = getIntersectionTransform(intersects[0]);
      shape.lookAt(n.normal as THREEVector3);
      shape.position.copy(n.position);
    }
  });

  useEffect(() => {
    setCursorVisible(!!addingWidget);
    setCursorStyle(addingWidget ? 'edit' : 'move');
    esc();
    gl.domElement.style.cursor = addingWidget ? 'none' : 'auto';
  }, [addingWidget]);

  return (
    <React.Suspense fallback={null}>
      {cursorVisible && <primitive ref={ref} object={shape} name='ViewCursorWidget' />}
    </React.Suspense>
  );
};
