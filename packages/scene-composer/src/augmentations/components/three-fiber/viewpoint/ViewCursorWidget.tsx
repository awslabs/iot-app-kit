import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { AlwaysDepth, Box3, Color, DoubleSide, Group, Mesh, MeshBasicMaterial, Object3D, ShapeGeometry, Vector3 } from 'three';
import { SVGLoader } from 'three-stdlib';

import { ViewCursorEditIcon, ViewCursorMoveIcon } from '../../../../assets';
import { getIntersectionTransform } from '../../../../utils/raycastUtils';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../../store';

export const ViewCursorWidget = () => {
  const { scene } = useThree();
  const ref = useRef<Object3D>(null);
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { cursorVisible, cursorStyle } = useEditorState(sceneComposerId);

  const svg = cursorStyle === 'edit' ? ViewCursorEditIcon : ViewCursorMoveIcon;
  const data = useLoader(SVGLoader, svg.dataUri);

  /* istanbul ignore next */
  const resetObjectCenter = useCallback((object: Object3D) => {
    const box = new Box3().setFromObject(object);
    box.getCenter(object.position);
    object.position.multiplyScalar(-1);
  }, [ref]);

  /* istanbul ignore next */
  const shape = useMemo(() => {
    const paths = data.paths;
    const svgGroup = new Group();

    paths?.forEach((path) => {
      const fillColor = path?.userData?.style.fill;
      if (fillColor !== undefined && fillColor !== 'none') {
        const material = new MeshBasicMaterial({
          color: new Color().setStyle(fillColor).convertSRGBToLinear(),
          opacity: path?.userData?.style.fillOpacity,
          transparent: true,
          depthFunc: AlwaysDepth,
          side: DoubleSide
        });
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((line) => {
          const geometry = new ShapeGeometry(line);
          const mesh = new Mesh(geometry, material);
          resetObjectCenter(mesh);
          svgGroup.add(mesh);
        });
      }

      const strokeColor = path?.userData?.style.stroke;
      if (strokeColor !== undefined && strokeColor !== 'none') {
        const material = new MeshBasicMaterial({
          color: new Color().setStyle(strokeColor).convertSRGBToLinear(),
          opacity: path?.userData?.style.strokeOpacity,
          transparent: true,
          depthFunc: AlwaysDepth,
          side: DoubleSide
        });
        path.subPaths.forEach((childPath) => {
          const geometry = SVGLoader.pointsToStroke(childPath.getPoints(), path?.userData?.style);
          if (geometry) {
            const mesh = new Mesh(geometry, material);
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
  useFrame(({ raycaster }) => {
    const sceneMeshes: Object3D[] = [];
    scene.traverse((child) => {
      return shape.id !== child.id && (child as Mesh).isMesh && child.type !== 'TransformControlsPlane' ? sceneMeshes.push(child as Mesh) : null;
    });
    console.log('sceneMeshes: ', sceneMeshes)
    const intersects = raycaster.intersectObjects(sceneMeshes, false);
    if (intersects.length) {
      const n = getIntersectionTransform(intersects[0]);
      shape.lookAt(n.normal as Vector3);
      shape.position.copy(n.position);
    }
  });

  return (
    <React.Suspense fallback={null}>
      {cursorVisible && <primitive ref={ref} object={shape} name='ViewCursorWidget' />}
    </React.Suspense>
  );
};
