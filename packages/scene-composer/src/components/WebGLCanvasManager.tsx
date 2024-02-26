import * as THREE from 'three';
import * as awsui from '@awsui/design-tokens';
import React, { useContext, useEffect, useRef, useReducer, useState } from 'react';
import { GizmoHelper, GizmoViewport, Sphere } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { MatterportModel } from '@matterport/r3f/dist';

import { KnownSceneProperty, COMPOSER_FEATURES } from '../interfaces';
import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import { useEditorState, useSceneDocument, useStore } from '../store';
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

import { Box } from '@react-three/drei';
import { getFaces } from '../utils/faceSelectionUtils';

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

  const gridHelperRef = useRef<THREE.GridHelper>(null);

  const [selectedVerticesArray, setSelectedVerticiesArray] = useState<Float32Array>();
  const [clickPointList, setClickPointList] = useState<THREE.Vector3[]>([]);
  const [centerPoint, setCenterPoint] = useState<THREE.Vector3>();
  const [radius, setRadius] = useState<number>();

  const [boxCenter, setBoxCenter] = useState<THREE.Vector3>();
  const [boxSize, setBoxSize] = useState<THREE.Vector3>();

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

  const BRUSH_RADIUS = 3;
  const onClickMeshBrush = (e: ThreeEvent<MouseEvent>) => {
    if(e.intersections.length > 0) {
      const object = e.intersections[0].object;
      if (object instanceof THREE.Mesh) {
        //console.log('got mesh', object, e.intersections[0].face);
        const clickPoint = e.intersections[0].point;
        const brushSphere = new THREE.Sphere(clickPoint, BRUSH_RADIUS);
        //console.log('generated brush zone', brushSphere);
        const mesh = object as THREE.Mesh;
        const geometry = mesh.geometry;
        
        const array = getFaces(geometry,brushSphere,mesh.matrixWorld);
        setSelectedVerticiesArray(array);

        //hide the model so we can see the result in dollhouse/floorplan (doesn't hide in explore)
        if(array) {
          const forcedMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00, opacity: 0.1, transparent:true});
          object.material = forcedMaterial;
          object.material.needsUpdate = true;
        }
      }
    }
  }

  const onClickSelectSphere = (e: ThreeEvent<MouseEvent>) => {
    const { position } = getIntersectionTransform(e.intersections[0]);
    if (clickPointList.length < 2) {
      clickPointList.push(position);
      //console.log('add click point: ', position);
      if (clickPointList.length === 2) {
        const radius = clickPointList[0].distanceTo(clickPointList[1])* .5;
        const centerPoint = new THREE.Vector3();
        //set centerpoint to mid point between clicks
        centerPoint.subVectors(clickPointList[0], clickPointList[1]);
        centerPoint.multiplyScalar(.5);
        //console.log('centerPoint length: ', centerPoint.length());
        centerPoint.add(clickPointList[1]);
        setRadius(radius);
        setCenterPoint(centerPoint);
        //console.log('set radius: ', radius, 'center: ', centerPoint);
        
        const object = e.intersections[0].object;
        if (object instanceof THREE.Mesh) {
          //console.log('got mesh', object, e.intersections[0].face);
          const mesh = object as THREE.Mesh;
          const geometry = mesh.geometry;
          const array = getFaces(geometry, new THREE.Sphere(centerPoint, radius), mesh.matrixWorld);
          setSelectedVerticiesArray(array);

          //hide the model so we can see the result in dollhouse/floorplan (doesn't hide in explore)
          // if(array) {
          //   const forcedMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00, opacity: 0.1, transparent:true});
          //   object.material = forcedMaterial;
          //   object.material.needsUpdate = true;
          // }
        }
      }
    }
  }
  
  const onClickMakeSphere = (e: ThreeEvent<MouseEvent>) => {
    const { position } = getIntersectionTransform(e.intersections[0]);
    if (clickPointList.length < 2) {
      clickPointList.push(position);
      //console.log('add click point: ', position);
      if (clickPointList.length === 2) {
        const radius = clickPointList[0].distanceTo(clickPointList[1])* .5;
        const centerPoint = new THREE.Vector3();
        //set centerpoint to mid point between clicks
        centerPoint.subVectors(clickPointList[0], clickPointList[1]);
        centerPoint.multiplyScalar(.5);
        //console.log('centerPoint length: ', centerPoint.length());
        centerPoint.add(clickPointList[1]);
        setRadius(radius);
        setCenterPoint(centerPoint);
        //console.log('set radius: ', radius, 'center: ', centerPoint);
      }
    }
  }

  const onClickMakeBox = (e: ThreeEvent<MouseEvent>) => {
    const { position } = getIntersectionTransform(e.intersections[0]);
    if (clickPointList.length < 3) {
      clickPointList.push(position);
      //console.log('add click point: ', position);
      if (clickPointList.length === 3) {
        //need size and center
        const box = new THREE.Box3();
        box.setFromPoints(clickPointList);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        setBoxCenter(center);
        setBoxSize(size);
      }
    }
  }

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
      {/* moved up outside of edit for view mode testing */}
      {enableMatterportViewer && (
        <React.Fragment>
          <MatterportModel onClick={onClickSelectSphere} />
          {boxCenter && boxSize &&
          <Box
            position = {boxCenter?.toArray()}
            scale = {1}
            name = {'3 Clicked Box'}
          >
            <boxGeometry args={boxSize.toArray()} />
            <meshStandardMaterial color={'hotpink'} transparent={true} opacity={.5}  />
          </Box>}
          {selectedVerticesArray && <mesh 
            position={[0, 0, 0]}
            name='Selected Faces without World Matrix Adjustment...'>
              <bufferGeometry attach="geometry">
                <bufferAttribute 
                  attach="attributes-position"
                  array={selectedVerticesArray}
                  count={selectedVerticesArray.length / 3}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshStandardMaterial color={'hotpink'} transparent={true} opacity={.5} />
          </mesh>
          }
          {radius && centerPoint && 
          <Sphere
            position={centerPoint.toArray()} 
            args={[radius]}
            name='2 click circle'
          >
            <meshStandardMaterial color={0xffffff} transparent={true} opacity={.5}  />
          </Sphere>}
        </React.Fragment>
      )}
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
