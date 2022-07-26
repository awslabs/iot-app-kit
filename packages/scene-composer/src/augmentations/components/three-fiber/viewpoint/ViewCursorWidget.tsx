import * as THREE from 'three';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { extend, useLoader, useThree } from '@react-three/fiber';
import { SVGLoader, SVGResult } from 'three-stdlib';

import { ViewCursorMoveIcon, ViewCursorEditIcon } from '../../../../assets';
import svgIconToWidgetVisual from '../common/SvgIconToWidgetVisual';
import { WidgetVisual } from '../../../three/visuals';
import { ViewCursor, Viewpoint, ViewpointState } from '../../../three';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../../store';

// Adds the custom objects to React Three Fiber
extend({ ViewCursor, Viewpoint, WidgetVisual });

const AsyncLoadViewCursorWidget: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { cursorPosition, cursorLookAt, cursorVisible, cursorStyle } = useEditorState(sceneComposerId);
  const viewCursorRef = useRef<Viewpoint>(null);
  const { camera } = useThree();

  const moveVisual = useMemo(() => {
    const svgData: SVGResult = useLoader(SVGLoader, ViewCursorMoveIcon.dataUri);
    return svgIconToWidgetVisual(svgData, ViewpointState.Deselected, false, { userData: { isCursor: true } });
  }, []);

  const editVisual = useMemo(() => {
    const svgData: SVGResult = useLoader(SVGLoader, ViewCursorEditIcon.dataUri);
    return svgIconToWidgetVisual(svgData, ViewpointState.Selected, false, { userData: { isCursor: true } });
  }, []);

  useEffect(() => {
    if (viewCursorRef.current) {
      viewCursorRef.current.lookAt(cursorLookAt);
      viewCursorRef.current.rotation.z = camera.rotation.z; // Prevent spinning and always be straight up and down
    }
  }, [cursorLookAt]);

  useEffect(() => {
    if (viewCursorRef.current) {
      viewCursorRef.current.traverse((child) => {
        const mesh = child as THREE.Mesh;

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              material.depthFunc = THREE.AlwaysDepth;
            });
          } else {
            (mesh.material as THREE.Material).depthFunc = THREE.AlwaysDepth;
          }
        }
      });
    }
  }, [viewCursorRef]);

  return (
    <viewCursor
      ref={viewCursorRef}
      isSelected={cursorStyle === 'edit'}
      position={cursorPosition}
      visible={cursorVisible}
    >
      {moveVisual}
      {editVisual}
    </viewCursor>
  );
};

export const ViewCursorWidget: React.FC = () => {
  return (
    <React.Suspense fallback={null}>
      <AsyncLoadViewCursorWidget />
    </React.Suspense>
  );
};
