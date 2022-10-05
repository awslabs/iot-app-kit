import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { AlwaysDepth as THREEAlwaysDepth, Box3 as THREEBox3, Color as THREEColor, DoubleSide as THREEDoubleSide, Group as THREEGroup, Mesh as THREEMesh, MeshBasicMaterial as THREEMeshBasicMaterial, Object3D as THREEObject3D, ShapeGeometry as THREEShapeGeometry, Vector3 as THREEVector3 } from 'three';
import { SVGLoader } from 'three-stdlib';

import { ViewCursorEditIcon as THREEViewCursorEditIcon, ViewCursorMoveIcon } from '../../../../assets';
import { getIntersectionTransform } from '../../../../utils/raycastUtils';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../../store';

export const ViewCursorWidget = () => {
  const ref = useRef<THREEObject3D>(null);
  const { gl } = useThree();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { addingWidget, cursorVisible, cursorStyle, setAddingWidget, setCursorVisible, setCursorStyle } = useEditorState(sceneComposerId);
  const svg = cursorStyle === 'edit' ? THREEViewCursorEditIcon : ViewCursorMoveIcon;
  const data = useLoader(SVGLoader, svg.dataUri);

  const esc = useCallback(() => {
    gl.domElement.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !!addingWidget) {
        setAddingWidget(undefined);
      }
    });
    return gl.domElement?.removeEventListener('keyup', setAddingWidget as any);
  }, [addingWidget])

  /* istanbul ignore next */
  const resetObjectCenter = useCallback((object: THREEObject3D) => {
    const box = new THREEBox3().setFromObject(object);
    box.getCenter(object.position);
    object.position.multiplyScalar(-1);
  }, [ref]);

  /* istanbul ignore next */
  const shape = useMemo(() => {
    const paths = data.paths;
    const svgGroup = new THREEGroup();

    paths?.forEach((path) => {
      const fillColor = path?.userData?.style.fill;
      if (fillColor !== undefined && fillColor !== 'none') {
        const material = new THREEMeshBasicMaterial({
          color: new THREEColor().setStyle(fillColor).convertSRGBToLinear(),
          opacity: path?.userData?.style.fillOpacity,
          transparent: true,
          depthFunc: THREEAlwaysDepth,
          side: THREEDoubleSide
        });
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((line) => {
          const geometry = new THREEShapeGeometry(line);
          const mesh = new THREEMesh(geometry, material);
          resetObjectCenter(mesh);
          svgGroup.add(mesh);
        });
      }

      const strokeColor = path?.userData?.style.stroke;
      if (strokeColor !== undefined && strokeColor !== 'none') {
        const material = new THREEMeshBasicMaterial({
          color: new THREEColor().setStyle(strokeColor).convertSRGBToLinear(),
          opacity: path?.userData?.style.strokeOpacity,
          transparent: true,
          depthFunc: THREEAlwaysDepth,
          side: THREEDoubleSide
        });
        path.subPaths.forEach((childPath) => {
          const geometry = SVGLoader.pointsToStroke(childPath.getPoints(), path?.userData?.style);
          if (geometry) {
            const mesh = new THREEMesh(geometry, material);
            resetObjectCenter(mesh);
            svgGroup.add(mesh);
          }
        });
      }
    });
    svgGroup.scale.multiplyScalar(0.005);
    return svgGroup;
  }, [data]);

  /* istanbul ignore next */
  useFrame(({ raycaster, scene }) => {
    const sceneMeshes: THREEObject3D[] = [];
    scene.traverse((child) => {
      return shape.id !== child.id && (child as THREEMesh).isMesh && child.type !== 'TransformControlsPlane' ? sceneMeshes.push(child as THREEMesh) : null;
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
    esc()
    gl.domElement.style.cursor = addingWidget ? 'none' : 'auto';
  }, [addingWidget]);

  return (
    <React.Suspense fallback={null}>
      {cursorVisible && <primitive ref={ref} object={shape} name='ViewCursorWidget' />}
    </React.Suspense>
  );
};
