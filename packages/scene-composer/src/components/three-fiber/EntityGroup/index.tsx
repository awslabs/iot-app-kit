import React, { useCallback, useContext, useRef } from 'react';
import { Euler, Object3D } from 'three';

import {
  ISceneNodeInternal,
  isISceneNodeInternal,
  ISubModelRefComponentInternal,
  useEditorState,
  useNodeErrorState,
  useSceneDocument,
} from '../../../store';
import { sceneComposerIdContext, useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { getChildrenGroupName, getEntityGroupName } from '../../../utils/objectThreeUtils';
import { KnownComponentType } from '../../../interfaces';
import LogProvider from '../../../logger/react-logger/log-provider';
import { isEnvironmentNode } from '../../../utils/nodeUtils';

import useCallbackWhenNotPanning from './useCallbackWhenNotPanning';
import ComponentGroup from './ComponentGroup';

interface IEntityGroupProps {
  node: ISceneNodeInternal;
}

const ChildGroup = ({ node }: { node: ISceneNodeInternal }) => {
  const sceneComposerId = useSceneComposerId();
  const { getSceneNodeByRef } = useSceneDocument(sceneComposerId);

  /* istanbul ignore next: Nullish coalesce */
  const childViews = node.childRefs?.map(getSceneNodeByRef)?.filter(isISceneNodeInternal);

  return (
    <group name={getChildrenGroupName(node.ref)}>
      {
        /* istanbul ignore next: Nullish coalesce */ childViews?.map((child) => (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <EntityGroup key={child.ref} node={child} />
        ))
      }
    </group>
  );
};

const EntityGroup = ({ node }: IEntityGroupProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const object3dRef = useRef<THREE.Object3D>();

  const { transform, ref: nodeRef, components } = node;
  const { rotation, position, scale } = transform;

  /* istanbul ignore next: Nullish coalesce */
  const componentTypes = components?.map((component) => component.type) || [];

  const { getObject3DBySceneNodeRef, selectedSceneNodeRef, setSceneNodeObject3DMapping, setSelectedSceneNodeRef } =
    useEditorState(sceneComposerId);
  const { addNodeError } = useNodeErrorState(sceneComposerId);

  const [onPointerDown, onPointerUp] = useCallbackWhenNotPanning(
    (e) => {
      e.stopPropagation(); // the most nested object in the click scope should get selected, and not bubble up to the parent.
      if (selectedSceneNodeRef === nodeRef) {
        setSelectedSceneNodeRef(undefined);
      } else {
        setSelectedSceneNodeRef(nodeRef);
      }
    },
    [selectedSceneNodeRef, nodeRef],
  );

  const setEntityGroupObject3DRef = useCallback(
    (obj3d: any) => {
      object3dRef.current = obj3d;

      if (componentTypes.includes(KnownComponentType.SubModelRef)) {
        // this is a submodel ref component
        const parentRef = node.parentRef;
        const { selector } = components[0] as ISubModelRefComponentInternal;
        const parentObj = getObject3DBySceneNodeRef(parentRef);
        const childObj = (parentObj?.getObjectById(Number(selector)) ||
          parentObj?.getObjectByName(selector as string)) as Object3D;
        if (childObj) {
          // this can be null sometimes, if we haven't loaded the model yet when loading GLTF
          setSceneNodeObject3DMapping(nodeRef, childObj);
        }
      } else {
        const obj = getObject3DBySceneNodeRef(nodeRef);
        if (obj3d && obj !== obj3d) {
          setSceneNodeObject3DMapping(nodeRef, obj3d);
        }
      }
    },
    [nodeRef],
  );

  const onError = useCallback(
    (error) => {
      addNodeError(node.ref, error);
    },
    [node],
  );

  return (
    <LogProvider namespace={'EntityGroup'} onError={onError}>
      <group
        name={getEntityGroupName(node.ref)}
        key={node.ref}
        ref={setEntityGroupObject3DRef}
        position={position}
        rotation={new Euler(...rotation, 'XYZ')}
        scale={scale}
        dispose={null}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        userData={{ nodeRef: !isEnvironmentNode(node) ? nodeRef : undefined, componentTypes }} // Do not add ref for environment nodes
      >
        <ComponentGroup node={node} components={node.components} />
        <ChildGroup node={node} />
      </group>
    </LogProvider>
  );
};

export default EntityGroup;
