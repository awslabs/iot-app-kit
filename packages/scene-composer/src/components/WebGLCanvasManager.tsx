import * as THREE from 'three';
import * as awsui from '@awsui/design-tokens';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';

import { KnownSceneProperty } from '../interfaces';
import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import { useEditorState, useSceneDocument, useStore } from '../store';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { hexColorFromDesignToken } from '../utils/styleUtils';
import { Layers, ROOT_OBJECT_3D_NAME } from '../common/constants';
import { getGlobalSettings } from '../common/GlobalSettings';
import { ViewCursorWidget } from '../augmentations/components/three-fiber/viewpoint/ViewCursorWidget';
import { getIntersectionTransform } from '../utils/raycastUtils';
import { createNodeWithPositionAndNormal } from '../utils/nodeUtils';

import Environment, { presets } from './three-fiber/Environment';
import { StatsWindow } from './three-fiber/StatsWindow';
import EntityGroup from './three-fiber/EntityGroup';
import { EditorMainCamera } from './three-fiber/EditorCamera';
import { EditorTransformControls } from './three-fiber/EditorTransformControls';
import { SceneInfoView } from './three-fiber/SceneInfoView';
import IntlProvider from './IntlProvider';

const GIZMO_MARGIN: [number, number] = [72, 72];

export const WebGLCanvasManager: React.FC = () => {
  const log = useLifecycleLogging('WebGLCanvasManager');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const { isEditing, addingWidget, setAddingWidget } = useEditorState(sceneComposerId);
  const { document, getSceneNodeByRef, getSceneProperty } = useSceneDocument(sceneComposerId);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const { gl } = useThree();
  const domRef = useRef<HTMLElement>(gl.domElement.parentElement);
  const environmentPreset = getSceneProperty(KnownSceneProperty.EnvironmentPreset);
  const rootNodeRefs = document.rootNodeRefs;

  const { setCursorPosition, setCursorLookAt, setCursorVisible, setCursorStyle } = useEditorState(sceneComposerId);

  const [startingPointerPosition, setStartingPointerPosition] = useState<THREE.Vector2>(new THREE.Vector2());

  const editingTargetPlaneRef = useRef<THREE.Object3D>();
  const gridHelperRef = useRef<THREE.GridHelper>();

  const MAX_CLICK_DISTANCE = 2;

  useEffect(() => {
    setCursorVisible(!!addingWidget);
    setCursorStyle(addingWidget ? 'edit' : 'move');
  }, [addingWidget]);

  useEffect(() => {
    if (!!environmentPreset && !(environmentPreset in presets)) {
      log?.error('Environment preset must be one of: ' + Object.keys(presets).join(', '));
    }
  }, [environmentPreset]);

  useEffect(() => {
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !!addingWidget) {
        setAddingWidget(undefined);
      }
    });
  }, [addingWidget]);

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    // Show only while hidden or adding widget
    if (addingWidget) {
      if (e.intersections.length > 0) {
        const { position, normal } = getIntersectionTransform(e.intersections[0]);
        setCursorPosition(position);
        setCursorLookAt(normal || new THREE.Vector3(0, 0, 0));
      }
    }
  };

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    setStartingPointerPosition(new THREE.Vector2(e.screenX, e.screenY));
  };

  const onPointerUp = (e: ThreeEvent<MouseEvent>) => {
    const currentPosition = new THREE.Vector2(e.screenX, e.screenY);
    if (startingPointerPosition.distanceTo(currentPosition) <= MAX_CLICK_DISTANCE) {
      if (addingWidget && e.intersections.length > 0) {
        const { position } = getIntersectionTransform(e.intersections[0]);
        const newWidgetNode = createNodeWithPositionAndNormal(addingWidget, position, new THREE.Vector3());

        appendSceneNode(newWidgetNode);
        setAddingWidget(undefined);

        e.stopPropagation();
      }
    }
  };

  useEffect(() => {
    const gridHelper = gridHelperRef.current;
    if (gridHelper) {
      gridHelper.layers.disable(Layers.RaycastAndRender);
      gridHelper.layers.enable(Layers.RenderOnly);
    }
  }, [gridHelperRef.current]);

  useEffect(() => {
    gl.domElement.style.cursor = addingWidget ? 'none' : 'auto';
  }, [addingWidget]);

  return (
    <React.Fragment>
      <EditorMainCamera />
      {environmentPreset in presets && <Environment preset={environmentPreset} />}
      <group name={ROOT_OBJECT_3D_NAME} dispose={null}>
        {rootNodeRefs &&
          rootNodeRefs.map((rootNodeRef) => {
            const node = getSceneNodeByRef(rootNodeRef);
            return node && <EntityGroup key={rootNodeRef} node={node} />;
          })}
      </group>
      {isEditing() && (
        <React.Fragment>
          <EditorTransformControls />
          <GizmoHelper alignment={'bottom-right'} margin={GIZMO_MARGIN} renderPriority={0}>
            <GizmoViewport
              axisColors={[
                hexColorFromDesignToken(awsui.colorBackgroundNotificationRed),
                hexColorFromDesignToken(awsui.colorBackgroundNotificationGreen),
                hexColorFromDesignToken(awsui.colorBackgroundNotificationBlue),
              ]}
            />
          </GizmoHelper>
          <ViewCursorWidget />
          <React.Fragment>
            <gridHelper
              ref={gridHelperRef}
              args={[
                1000 /* size */,
                500 /* grid# */,
                new THREE.Color(hexColorFromDesignToken(awsui.colorTextInputPlaceholder)) /* center line color */,
                new THREE.Color(hexColorFromDesignToken(awsui.colorBorderContainerTop)) /* grid color */,
              ]}
            />
            <mesh
              ref={editingTargetPlaneRef}
              name={'Ground'}
              rotation={[THREE.MathUtils.degToRad(270), 0, 0]}
              onPointerUp={onPointerUp}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
            >
              <planeGeometry args={[1000, 1000]} />
              <meshBasicMaterial colorWrite={false} />
            </mesh>
          </React.Fragment>
          <IntlProvider locale={getGlobalSettings().locale}>
            <SceneInfoView />
          </IntlProvider>

          {getGlobalSettings().debugMode && <StatsWindow parent={domRef} />}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
