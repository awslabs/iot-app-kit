import React, { useEffect, Fragment } from 'react';
import { Mesh, Vector3, Euler } from 'three';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ISceneNodeInternal, useEditorState } from '../../../store';
import { ISubModelRefComponent } from '../../../interfaces';

const SubModelComponent = ({ component, node }: { component: ISubModelRefComponent; node: ISceneNodeInternal }) => {
  const sceneComposerId = useSceneComposerId();
  const { getObject3DBySceneNodeRef, setSceneNodeObject3DMapping } = useEditorState(sceneComposerId);

  const object = getObject3DBySceneNodeRef(node.ref);
  const parentObj = getObject3DBySceneNodeRef(node.parentRef);

  useEffect(() => {
    if (parentObj && !object) {
      const obj =
        parentObj.getObjectById(Number(component.selector)) || parentObj.getObjectByName(component.selector as string);

      if (obj) {
        setSceneNodeObject3DMapping(node.ref, obj);
      }
    } // Test
  }, [parentObj, object]);

  const { transform } = node;

  useEffect(() => {
    const mesh = object as Mesh;

    if (mesh) {
      mesh.scale.copy(new Vector3(...transform.scale));
      mesh.position.copy(new Vector3(...transform.position));
      mesh.rotation.copy(new Euler(...transform.rotation));
    }
  }, [transform, object]);

  return <Fragment />;
};

SubModelComponent.displayName = 'SubModelComponent';

export default SubModelComponent;
