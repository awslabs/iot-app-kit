import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Mesh as THREEMesh, Object3D as THREEObject3D, Vector3 as THREEVector3, Vector3 } from 'three';
import { SVGLoader } from 'three-stdlib';
import { TilesGroup } from '3d-tiles-renderer';

import { convertSvgToMesh, getDataUri } from '../../../../utils/svgUtils';
import { getIntersectionTransform } from '../../../../utils/raycastUtils';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../../store';
import { ViewCursorEditSvgString, ViewCursorMoveSvgString } from '../../../../assets/svgs';

export const INIT_SVG_SCALE = 0.003;
export const INIT_SVG_VECTOR = new Vector3(INIT_SVG_SCALE, INIT_SVG_SCALE, INIT_SVG_SCALE);

export const ViewCursorWidget = () => {
  const ref = useRef<THREEObject3D>(null);
  const { gl } = useThree();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { addingWidget, cursorVisible, cursorStyle, setAddingWidget, setCursorVisible, setCursorStyle } =
    useEditorState(sceneComposerId);
  const svg = cursorStyle === 'edit' ? ViewCursorEditSvgString : ViewCursorMoveSvgString;
  const data = useLoader(SVGLoader, getDataUri(svg));

  const esc = useCallback(() => {
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !!addingWidget) {
        setAddingWidget(undefined);
      }
    });
    return window.removeEventListener('keyup', setAddingWidget as any);
  }, [addingWidget]);

  const shape = useMemo(() => {
    return convertSvgToMesh(data, INIT_SVG_SCALE);
  }, [data]);

  useFrame(({ raycaster, scene }) => {
    const sceneObjects: THREEObject3D[] = [];
    scene.traverse((child) => {
      // Raycast is handled at the TilesGroup level
      if ((child as TilesGroup).tilesRenderer) {
        return sceneObjects.push(child as THREEObject3D);
      }
      const mesh = child as THREEMesh;
      if (
        shape.id !== mesh.id &&
        mesh.isMesh &&
        mesh.type !== 'TransformControlsPlane' &&
        mesh.parent?.parent?.type !== 'TransformControlsGizmo' && // Don't include the gizmo objects
        !(mesh.parent?.parent?.parent as TilesGroup)?.tilesRenderer // Don't include meshes in the 3D Tiles
      ) {
        return sceneObjects.push(mesh);
      }
      return null;
    });
    // Calculate closest intersection
    const intersects = raycaster.intersectObjects(sceneObjects, false);
    if (intersects.length) {
      // Intersections are sorted
      const closestIntersection = intersects[0];
      const n = getIntersectionTransform(closestIntersection);
      shape.lookAt(n.normal as THREEVector3);
      shape.position.copy(n.position);
      // Set scale based on intersection distance
      shape.scale.copy(INIT_SVG_VECTOR);
      shape.scale.multiplyScalar(closestIntersection.distance);
    }
  });

  useEffect(() => {
    setCursorVisible(!!addingWidget);
    setCursorStyle(addingWidget ? 'edit' : 'move');
    esc();
    gl.domElement.style.cursor = addingWidget ? 'crosshair' : 'auto';
  }, [addingWidget]);

  return (
    <React.Suspense fallback={null}>
      {cursorVisible && <primitive ref={ref} object={shape} name='ViewCursorWidget' />}
    </React.Suspense>
  );
};
