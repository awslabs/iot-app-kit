import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';

import { findComponentByType } from '../../../utils/nodeUtils';
import { KnownComponentType } from '../../../interfaces';
import { ICameraComponentInternal, useStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { getCameraSettings } from '../../../utils/cameraUtils';

type CanvasSize = {
  height: number;
  width: number;
};

export type CameraPreviewProps = {
  /** The tracking element, the view will be cut according to its whereabouts */
  track: React.MutableRefObject<HTMLElement>;
  clearColor?: string;
};

// Optimization for variable instantiation in useFrame
const originalColor = new THREE.Color();
const originalViewport = new THREE.Vector4();
const originalScissor = new THREE.Vector4();
let originalScissorTest = false;
let originalAlpha = 0;

export const CameraPreview: React.FC<CameraPreviewProps> = ({ track, clearColor = '#2A2E33' }) => {
  const rect = useRef<DOMRect>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const sceneComposerId = useSceneComposerId();
  const { selectedSceneNodeRef, getSceneNodeByRef, getObject3DBySceneNodeRef } = useStore(sceneComposerId)();

  const previewClearColor = new THREE.Color(clearColor);

  // Pulling from the store rather than the hook meant that this saw the immediate updates to the node.
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
  const cameraComponent = findComponentByType(selectedSceneNode, KnownComponentType.Camera) as ICameraComponentInternal;
  const object3D = getObject3DBySceneNodeRef(selectedSceneNodeRef);

  const cameraSettings = getCameraSettings(object3D, cameraComponent);

  const computeContainerPosition = (
    canvasRect: DOMRect,
    trackRect: DOMRect,
  ): CanvasSize & { top: number; left: number; bottom: number; right: number } => {
    const { right, top, left: trackLeft, bottom: trackBottom, width, height } = trackRect;

    const canvasBottom = canvasRect.top + canvasRect.height;
    const bottom = canvasBottom - Math.floor(trackBottom); // Floor avoids gaps due to CSS calculations floating point values
    const left = trackLeft - canvasRect.left;

    return { width, height, left, top, bottom, right };
  };

  useEffect(() => {
    if (track.current) {
      rect.current = track.current.getBoundingClientRect();
    }
  }, [track.current]);

  // Render the original scene first
  useFrame((state) => {
    state.gl.render(state.scene, state.camera);
  }, 0);

  // Preview Render (Late render due to renderPriority set to 1)
  useFrame((state) => {
    if (rect.current && cameraRef.current && track.current) {
      const canvasRect = state.gl.domElement.getBoundingClientRect();
      rect.current = track.current.getBoundingClientRect();

      const { left, bottom, width, height } = computeContainerPosition(canvasRect, rect.current);
      const aspect = width / height;

      if (cameraRef.current.aspect !== aspect) {
        cameraRef.current.aspect = aspect;
        cameraRef.current.updateProjectionMatrix();
      }

      state.gl.getViewport(originalViewport);
      state.gl.getScissor(originalScissor);
      originalScissorTest = state.gl.getScissorTest();
      state.gl.getClearColor(originalColor);
      originalAlpha = state.gl.getClearAlpha();

      state.gl.setViewport(left, bottom, width, height);
      state.gl.setScissor(left, bottom, width, height);
      state.gl.setScissorTest(true);

      state.gl.setClearColor(previewClearColor, 1);
      state.gl.clear(true, true);
      state.gl.render(state.scene, cameraRef.current);
    }
  }, 1);

  // Restore renderer
  useFrame((state) => {
    // Clean up
    state.gl.setViewport(originalViewport);
    state.gl.setScissor(originalScissor);
    state.gl.setScissorTest(originalScissorTest);
    state.gl.setClearColor(originalColor, originalAlpha);
  }, 2);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      fov={cameraSettings.fov}
      near={cameraSettings.near}
      far={cameraSettings.far}
      zoom={cameraSettings.zoom}
      {...cameraSettings.transform}
    />
  );
};
