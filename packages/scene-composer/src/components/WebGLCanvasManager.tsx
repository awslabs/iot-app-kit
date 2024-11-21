import * as awsui from '@cloudscape-design/design-tokens';
import { MatterportModel } from '@matterport/r3f/dist';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { type ThreeEvent, useThree } from '@react-three/fiber';
import { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { ViewCursorWidget } from '../augmentations/components/three-fiber/viewpoint/ViewCursorWidget';
import { Layers, MAX_CLICK_DISTANCE, ROOT_OBJECT_3D_NAME } from '../common/constants';
import { getGlobalSettings } from '../common/GlobalSettings';
import { EnvironmentLoadingManager } from '../common/loadingManagers';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import useMatterportViewer from '../hooks/useMatterportViewer';
import { COMPOSER_FEATURES, KnownSceneProperty } from '../interfaces';
import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import { accessStore, useEditorState, useSceneDocument } from '../store';
import { createNodeWithPositionAndNormal } from '../utils/nodeUtils';
import { getIntersectionTransform } from '../utils/raycastUtils';
import { hexColorFromDesignToken } from '../utils/styleUtils';

import IntlProvider from './IntlProvider';
import { EditorMainCamera } from './three-fiber/EditorCamera';
import { EditorTransformControls } from './three-fiber/EditorTransformControls';
import EntityGroup from './three-fiber/EntityGroup';
import Environment, { presets } from './three-fiber/Environment';
import Fog from './three-fiber/Fog';
import GroundPlane from './three-fiber/GroundPlane';
import SceneBackground from './three-fiber/SceneBackground';
import { SceneInfoView } from './three-fiber/SceneInfoView';
import { StatsWindow } from './three-fiber/StatsWindow';

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
      // @ts-expect-error type mismatch after update
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
    <>
      {sceneAppearanceEnabled && (
        <>
          <Fog />
          <SceneBackground />
        </>
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
        <>
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
          <>
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
          </>
          <IntlProvider locale={getGlobalSettings().locale}>
            <SceneInfoView />
          </IntlProvider>

          {getGlobalSettings().debugMode && <StatsWindow parent={domRef} />}
        </>
      )}
    </>
  );
};
