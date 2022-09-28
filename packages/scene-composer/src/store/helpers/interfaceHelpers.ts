import { ISceneComponent, ISceneNode } from '../../interfaces';
import { ISceneComponentInternal, ISceneNodeInternal, isISceneComponentInternal } from '../internalInterfaces';
import { generateUUID } from '../../utils/mathUtils';

function createSceneComponentInternal(component: ISceneComponent): ISceneComponentInternal | undefined {
  // Ensure the ref is generated
  const ref = component.ref ?? generateUUID();
  // Make a copy to avoid external mutation
  return { ...component, ref };
}

// This is a helper function to create an internal representation of a scene
// node based on the extenal interface
function createSceneNodeInternal(node: ISceneNode) {
  const uuid = node.ref ?? generateUUID();
  const result: ISceneNodeInternal = {
    ref: uuid,
    name: node.name || uuid,
    transform: node.transform ?? { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
    transformConstraint: node.transformConstraint ?? {},
    components: node.components
      ? node.components.map((component) => createSceneComponentInternal(component)).filter(isISceneComponentInternal)
      : [],
    parentRef: node.parentRef,
    childRefs: node.childRefs ? [...node.childRefs] : [],
    properties: node.properties ? node.properties : {},
  };

  return result;
}

export default {
  createSceneNodeInternal,
  createSceneComponentInternal,
};
