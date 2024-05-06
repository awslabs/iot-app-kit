import * as THREE from 'three';
import * as awsui from '@cloudscape-design/design-tokens';
import React, { useContext, useEffect, useRef } from 'react';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { MatterportModel } from '@matterport/r3f/dist';

import { KnownSceneProperty, COMPOSER_FEATURES } from '../interfaces';
import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import { useEditorState, useSceneDocument, accessStore } from '../store';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { hexColorFromDesignToken } from '../utils/styleUtils';
import { Layers, ROOT_OBJECT_3D_NAME, MAX_CLICK_DISTANCE } from '../common/constants';
import { getGlobalSettings } from '../common/GlobalSettings';
import { ViewCursorWidget } from '../augmentations/components/three-fiber/viewpoint/ViewCursorWidget';
import { getIntersectionTransform } from '../utils/raycastUtils';
import { createNodeWithPositionAndNormal } from '../utils/nodeUtils';
import { EnvironmentLoadingManager } from '../common/loadingManagers';
import useMatterportViewer from '../hooks/useMatterportViewer';

import Environment, { presets } from './three-fiber/Environment';
import Fog from './three-fiber/Fog';
import GroundPlane from './three-fiber/GroundPlane';
import { StatsWindow } from './three-fiber/StatsWindow';
import EntityGroup from './three-fiber/EntityGroup';
import { EditorMainCamera } from './three-fiber/EditorCamera';
import { EditorTransformControls } from './three-fiber/EditorTransformControls';
import { SceneInfoView } from './three-fiber/SceneInfoView';
import SceneBackground from './three-fiber/SceneBackground';
import IntlProvider from './IntlProvider';

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
  const appendSceneNode = accessStore(sceneComposerId)((state) => state.appendSceneNode);
  const { gl } = useThree();

  const domRef = useRef<HTMLElement>(gl.domElement.parentElement);
  const environmentPreset = getSceneProperty<string>(KnownSceneProperty.EnvironmentPreset);
  const rootNodeRefs = document.rootNodeRefs;

  const gridHelperRef = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    if (!!environmentPreset && !(environmentPreset in presets)) {
      log?.error('Environment preset must be one of: ' + Object.keys(presets).join(', '));
    }
  }, [environmentPreset]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta <= MAX_CLICK_DISTANCE && addingWidget && e.intersections.length > 0) {
      const { position } = getIntersectionTransform(e.intersections[0]);
      const newWidgetNode = createNodeWithPositionAndNormal(addingWidget, position, new THREE.Vector3());

      setAddingWidget(undefined);
      appendSceneNode(newWidgetNode);

      e.stopPropagation();
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
      {sceneAppearanceEnabled && (
        <React.Fragment>
          <Fog />
          <SceneBackground />
        </React.Fragment>
      )}
      <EditorMainCamera />
      {environmentPreset && environmentPreset in presets && (
        <Environment preset={environmentPreset} extensions={envLoaderExtension} />
      )}
      <group name={ROOT_OBJECT_3D_NAME} dispose={null}>
        {rootNodeRefs &&
          rootNodeRefs.map((rootNodeRef) => {
            const node = getSceneNodeByRef(rootNodeRef);
            return node && <EntityGroup key={rootNodeRef} node={node} />;
          })}
      </group>
      <GroundPlane />
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
              position={new THREE.Vector3(0, 0.001, 0)}
              args={[
                1000 /* size */,
                500 /* grid# */,
                hexColorFromDesignToken(awsui.colorTextInputPlaceholder) /* center line color */,
                hexColorFromDesignToken(awsui.colorTextInputDisabled) /* grid color */,
              ]}
            />
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
