import * as THREE from 'three';
import * as awsui from '@awsui/design-tokens';
import React, { useContext, useEffect, useRef } from 'react';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { MatterportModel } from '@matterport/r3f/dist';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { KnownSceneProperty, COMPOSER_FEATURES } from '../interfaces';
import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import { useEditorState, useSceneDocument, useStore } from '../store';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { hexColorFromDesignToken } from '../utils/styleUtils';
import { Layers, ROOT_OBJECT_3D_NAME } from '../common/constants';
import { getGlobalSettings } from '../common/GlobalSettings';
import { ViewCursorWidget } from '../augmentations/components/three-fiber/viewpoint/ViewCursorWidget';
import { getIntersectionTransform } from '../utils/raycastUtils';
import { createNodeWithPositionAndNormal } from '../utils/nodeUtils';
import { EnvironmentLoadingManager } from '../common/loadingManagers';
import useMatterportViewer from '../hooks/useMatterportViewer';
import useDynamicScene from '../hooks/useDynamicScene';

import Environment, { presets } from './three-fiber/Environment';
import Fog from './three-fiber/Fog';
import { StatsWindow } from './three-fiber/StatsWindow';
import EntityGroup from './three-fiber/EntityGroup';
import { EditorMainCamera } from './three-fiber/EditorCamera';
import { EditorTransformControls } from './three-fiber/EditorTransformControls';
import { SceneInfoView } from './three-fiber/SceneInfoView';
import IntlProvider from './IntlProvider';
import { SceneLayers } from './SceneLayers';

const queryClient = new QueryClient();

const GIZMO_MARGIN: [number, number] = [72, 72];

const envLoaderExtension = (loader: THREE.Loader) => {
  loader.manager = EnvironmentLoadingManager;
};

export const WebGLCanvasManager: React.FC = () => {
  const log = useLifecycleLogging('WebGLCanvasManager');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const { isEditing, addingWidget, setAddingWidget } = useEditorState(sceneComposerId);
  const sceneAppearanceEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.SceneAppearance];
  const { enableMatterportViewer } = useMatterportViewer();
  const { document, getSceneNodeByRef, getSceneProperty } = useSceneDocument(sceneComposerId);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const { gl } = useThree();
  const domRef = useRef<HTMLElement>(gl.domElement.parentElement);
  const environmentPreset = getSceneProperty<string>(KnownSceneProperty.EnvironmentPreset);
  const rootNodeRefs = document.rootNodeRefs;
  const dynamicSceneEnabled = useDynamicScene();

  const editingTargetPlaneRef = useRef(null);
  const gridHelperRef = useRef<THREE.GridHelper>(null);

  const MAX_CLICK_DISTANCE = 2;

  useEffect(() => {
    if (!!environmentPreset && !(environmentPreset in presets)) {
      log?.error('Environment preset must be one of: ' + Object.keys(presets).join(', '));
    }
  }, [environmentPreset]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta <= MAX_CLICK_DISTANCE) {
      if (addingWidget && e.intersections.length > 0) {
        const { position } = getIntersectionTransform(e.intersections[0]);
        const newWidgetNode = createNodeWithPositionAndNormal(addingWidget, position, new THREE.Vector3());

        setAddingWidget(undefined);
        appendSceneNode(newWidgetNode);

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

  return (
    <React.Fragment>
      {sceneAppearanceEnabled && <Fog />}
      <EditorMainCamera />
      {environmentPreset && environmentPreset in presets && (
        <Environment preset={environmentPreset} extensions={envLoaderExtension} />
      )}
      {dynamicSceneEnabled && (
        <QueryClientProvider client={queryClient}>
          <SceneLayers />
        </QueryClientProvider>
      )}
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
          <GizmoHelper alignment='bottom-right' margin={GIZMO_MARGIN} renderPriority={0}>
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
                hexColorFromDesignToken(awsui.colorTextInputPlaceholder) /* center line color */,
                hexColorFromDesignToken(awsui.colorTextInputDisabled) /* grid color */,
              ]}
            />
            <mesh
              ref={editingTargetPlaneRef}
              name='Ground'
              rotation={[THREE.MathUtils.degToRad(270), 0, 0]}
              onClick={onClick}
              renderOrder={enableMatterportViewer ? 1 : undefined}
            >
              <planeGeometry args={[1000, 1000]} />
              <meshBasicMaterial colorWrite={false} />
            </mesh>
            {enableMatterportViewer && <MatterportModel onClick={onClick} />}
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
