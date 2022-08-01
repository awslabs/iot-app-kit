import * as THREE from 'three';
import React, { Fragment, useCallback, useContext, useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';

import {
  IAnchorComponentInternal,
  ICameraComponentInternal,
  IColorOverlayComponentInternal,
  ILightComponentInternal,
  IModelRefComponentInternal,
  IMotionIndicatorComponentInternal,
  ISceneNodeInternal,
  isISceneNodeInternal,
  useEditorState,
  useSceneDocument,
  useViewOptionState,
} from '../../store';
import { KnownComponentType, SelectionChangedEventCallback } from '../../interfaces';
import { ModelType } from '../../models/SceneModels';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { getChildrenGroupName, getComponentsGroupName, getEntityGroupName } from '../../utils/objectThreeUtils';

import { AnchorComponent } from './AnchorComponent';
import { GLTFModelComponent } from './GLTFModelComponent';
import { CameraComponent } from './CameraComponent';
import { LightComponent } from './LightComponent';
import { ColorOverlayComponent } from './ColorOverlayComponent';
import { MotionIndicatorComponent } from './motion-indicator';
import { TilesModelComponent } from './TilesModelComponent';
import { ViewpointComponent } from './ViewpointComponent';

interface IEntityGroupProps {
  node: ISceneNodeInternal;
}

export const getPointerEventHandler =
  (
    lastPointerDownLocation: React.MutableRefObject<[number, number] | null>,
    node: ISceneNodeInternal,
    setSelectedSceneNodeRef: (nodeRef?: string) => void,
    selectedSceneNodeRef?: string,
  ) =>
  (e: ThreeEvent<MouseEvent>) => {
    const isValidMouseClick = (e: ThreeEvent<MouseEvent>) => {
      const { clientX, clientY } = e;
      if (!lastPointerDownLocation.current) {
        return false;
      }

      // clone the shared variable to a local variable
      const pointerDownLocation = [lastPointerDownLocation.current[0], lastPointerDownLocation.current[1]];
      lastPointerDownLocation.current = null;

      return Math.abs(clientX - pointerDownLocation[0]) < 1 && Math.abs(clientY - pointerDownLocation[1]) < 1;
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      if (!isValidMouseClick(e)) {
        return;
      }

      if (selectedSceneNodeRef === node.ref) {
        setSelectedSceneNodeRef(undefined);
      } else {
        setSelectedSceneNodeRef(node.ref);
      }
    };

    const { type, clientX, clientY } = e;
    if (type === 'pointerup') {
      e.stopPropagation();
      handleClick(e);
    } else if (type === 'pointerdown') {
      lastPointerDownLocation.current = [clientX, clientY];
    }
  };

const EntityGroup = ({ node }: IEntityGroupProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const object3dRef = useRef<THREE.Object3D>();
  const lastPointerDownLocation = useRef<[number, number] | null>(null);
  const { motionIndicatorVisible } = useViewOptionState(sceneComposerId);

  const {
    cameraControlsType,
    getObject3DBySceneNodeRef,
    selectedSceneNodeRef,
    setSceneNodeObject3DMapping,
    setSelectedSceneNodeRef,
  } = useEditorState(sceneComposerId);

  const { getSceneNodeByRef } = useSceneDocument(sceneComposerId);

  const onPointerEvent = getPointerEventHandler(
    lastPointerDownLocation,
    node,
    setSelectedSceneNodeRef,
    selectedSceneNodeRef,
  );

  const setEntityGroupObject3DRef = useCallback(
    (obj3d: any) => {
      if (obj3d && getObject3DBySceneNodeRef(node.ref) !== obj3d) {
        object3dRef.current = obj3d;
        setSceneNodeObject3DMapping(node.ref, obj3d);
      }
    },
    [node],
  );

  const getComponentViews = () => {
    return node.components?.map((component, index) => {
      if (component.type === KnownComponentType.ModelRef) {
        const modelRefComponent = component as IModelRefComponentInternal;
        if (modelRefComponent.modelType === ModelType.GLB || modelRefComponent.modelType === ModelType.GLTF) {
          return (
            <GLTFModelComponent
              key={index}
              node={node}
              component={modelRefComponent}
              hiddenWhileImmersive={node.properties.hiddenWhileImmersive === true && cameraControlsType === 'immersive'}
            />
          );
        } else if (modelRefComponent.modelType === ModelType.Tiles3D) {
          return <TilesModelComponent key={index} node={node} component={component as IModelRefComponentInternal} />;
        } else {
          // Unknown model type, this line will never be reached createModelRefComponent blocks unknown model type
          return undefined;
        }
      } else if (component.type === KnownComponentType.Tag) {
        return <AnchorComponent key={index} node={node} component={component as IAnchorComponentInternal} />;
      } else if (component.type === KnownComponentType.Camera) {
        return <CameraComponent key={index} node={node} component={component as ICameraComponentInternal} />;
      } else if (component.type === KnownComponentType.Light) {
        return <LightComponent key={index} node={node} component={component as ILightComponentInternal} />;
      } else if (component.type === KnownComponentType.ModelShader) {
        return (
          <ColorOverlayComponent key={index} node={node} component={component as IColorOverlayComponentInternal} />
        );
      } else if (component.type === KnownComponentType.MotionIndicator) {
        return (
          motionIndicatorVisible && (
            <MotionIndicatorComponent
              key={index}
              node={node}
              component={component as IMotionIndicatorComponentInternal}
            />
          )
        );
      } else if (component.type === KnownComponentType.Viewpoint) {
        return <ViewpointComponent key={index} node={node} />;
      } else {
        return <Fragment key={index}></Fragment>;
      }
    });
  };

  const componentTypes = node.components?.map((component) => component.type) || [];

  const childViews = node.childRefs
    ?.map(getSceneNodeByRef)
    ?.filter(isISceneNodeInternal)
    .map((childNode) => <EntityGroup key={childNode.ref} node={childNode} />);

  return (
    <Fragment>
      <group
        name={getEntityGroupName(node.ref)}
        key={node.ref}
        ref={setEntityGroupObject3DRef}
        position={node.transform.position}
        rotation={new THREE.Euler(...node.transform.rotation, 'XYZ')}
        scale={node.transform.scale}
        dispose={null}
        onPointerDown={onPointerEvent}
        onPointerUp={onPointerEvent}
        userData={{ nodeRef: node.ref, componentTypes: componentTypes }}
      >
        <group name={getComponentsGroupName(node.ref)}>{getComponentViews()}</group>
        <group name={getChildrenGroupName(node.ref)}>{childViews}</group>
      </group>
    </Fragment>
  );
};

export default EntityGroup;
