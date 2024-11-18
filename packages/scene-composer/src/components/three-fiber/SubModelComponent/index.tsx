import { useEffect, Fragment } from 'react';
import { type Mesh, Vector3, Euler } from 'three';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { type ISceneNodeInternal, useEditorState, useSceneDocument } from '../../../store';
import { type ISubModelRefComponent } from '../../../interfaces';

const SubModelComponent = ({ component, node }: { component: ISubModelRefComponent; node: ISceneNodeInternal }) => {
  const sceneComposerId = useSceneComposerId();
  const { getObject3DBySceneNodeRef, setSceneNodeObject3DMapping } = useEditorState(sceneComposerId);
  // Rerender after nodeMap is changed to fix the issue when the main model is rendered after the sub model that causes
  // the sub model component not able to find the parent object.
  const { nodeMap: _nodeMap } = useSceneDocument(sceneComposerId).document;

  const object = getObject3DBySceneNodeRef(node.ref);
  const parentObj = getObject3DBySceneNodeRef(node.parentRef);

  useEffect(() => {
    if (parentObj) {
      const obj =
        parentObj.getObjectById(Number(component.selector)) || parentObj.getObjectByName(component.selector as string);

      if (obj) {
        setSceneNodeObject3DMapping(node.ref, obj);
      }
    } // Test
  }, [parentObj]);

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
