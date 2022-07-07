import * as THREE from 'three';

import { ISceneComponentInternal, ISceneNodeInternal } from '../store';
import { AddingWidgetInfo, KnownComponentType } from '../interfaces';

/**
 * Finds a component on a node by type
 * @param node the node to search
 * @param type the KnownComponentType
 * @returns the component or undefined
 */
export const findComponentByType = (
  node: ISceneNodeInternal | undefined,
  type: KnownComponentType,
): ISceneComponentInternal | undefined => {
  if (!node) {
    return undefined;
  }

  const componentsOfType = node.components.filter((component) => {
    return component.type === type;
  });

  return componentsOfType?.length > 0 ? componentsOfType[0] : undefined;
};

/**
 * Viable Parents are those that can have children. These are the Root Scene (undefined), ModelRef, and Empty (Group) objects
 * @param {THREE.Object3D} object the object to check
 * @returns {boolean} true if the object is a Viable Parent
 */
const isViableParent = (object: THREE.Object3D): boolean => {
  return (
    object.userData.nodeRef &&
    (object.userData.componentTypes?.includes(KnownComponentType.ModelRef) ||
      object.userData.componentTypes?.length === 0)
  );
};

/**
 * Finds a parent that is allowed to have child nodes.
 * @param {THREE.Object3D} object the starting target
 * @returns {Object3D | undefined} the object that can be a parent or undefined.
 */
export function findNearestViableParentAncestorNodeRef(object?: THREE.Object3D): THREE.Object3D | undefined {
  if (!object) return;

  let parent: THREE.Object3D | null = object;
  while (parent) {
    if (isViableParent(parent)) return parent;
    parent = parent.parent;
  }

  return undefined;
}

/**
 * Creates a new scene node from new widget info attaching an appropriate transform.
 * @param newWidget the new widget node information
 * @param position the position to place the item
 * @param normal the normal to the surface
 * @param parent (Optional) parent to attach to
 * @returns the new scene node
 */
export function createNodeWithTransform(
  newWidget: AddingWidgetInfo,
  position: THREE.Vector3,
  normal: THREE.Vector3,
  parent?: THREE.Object3D,
): ISceneNodeInternal {
  const finalPosition = parent?.worldToLocal(position.clone()) ?? position;
  return {
    ...newWidget.node,
    parentRef: parent?.userData.nodeRef,
    transform: {
      position: finalPosition.toArray(),
      rotation: [0, 0, 0], // TODO: Find why the normal is producing weird orientations
      scale: [1, 1, 1],
    },
  } as ISceneNodeInternal;
}
