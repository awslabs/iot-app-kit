import { type TilesGroup } from '3d-tiles-renderer';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { type Mesh as THREEMesh, type Object3D as THREEObject3D, Vector3 as THREEVector3 } from 'three';
import { SVGLoader } from 'three-stdlib';

import { ViewCursorEditSvgString, ViewCursorMoveSvgString } from '../../../../assets/svgs';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../../store';
import { getIntersectionTransform } from '../../../../utils/raycastUtils';
import { convertSvgToMesh, getDataUri } from '../../../../utils/svgUtils';

export const INIT_SVG_SCALE = 0.003;
export const INIT_SVG_VECTOR = new THREEVector3(INIT_SVG_SCALE, INIT_SVG_SCALE, INIT_SVG_SCALE);

export const ViewCursorWidget = (): React.JSX.Element => {
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
      const normalVector = n.normal as THREEVector3;
      // Intersection surface normal may not be a uniform vector, like for point clouds
      if (normalVector) {
        shape.lookAt(n.normal as THREEVector3);
        shape.position.copy(n.position);
        // Set scale based on intersection distance
        shape.scale.copy(INIT_SVG_VECTOR);
        shape.scale.multiplyScalar(closestIntersection.distance);
      }
    }
  });

  useEffect(() => {
    setCursorVisible(!!addingWidget);
    setCursorStyle(addingWidget ? 'edit' : 'move');
    esc();
    gl.domElement.style.cursor = addingWidget ? 'crosshair' : 'auto';
  }, [addingWidget]);

  return (
    <Suspense fallback={null}>
      {cursorVisible && <primitive ref={ref} object={shape} name='ViewCursorWidget' />}
    </Suspense>
  );
};
