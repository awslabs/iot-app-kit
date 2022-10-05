import * as THREE from 'three';

import { IModelRefComponentInternal, ISceneComponentInternal, ISceneNodeInternal } from '../store';
import { AddingWidgetInfo, KnownComponentType } from '../interfaces';
import { ModelType } from '../models/SceneModels';

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
  return !!object.userData.nodeRef;
};

type Transform = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
};

/**
 * Get the final position and rotation from all the ancestors
 * @param {Transform} transform
 * @param {THREE.Object3D} parent
 * @returns {Transform} final transform based on all ancestors.
 */
const getFinalTransform = (transform: Transform, parent?: THREE.Object3D | null): Transform => {
  if (!parent) return transform;

  const finalPosition = parent.worldToLocal(transform.position.clone());

  const parentInverseQuaternion = parent.getWorldQuaternion(new THREE.Quaternion()).invert();
  const childWorldQuaternion = new THREE.Quaternion().setFromEuler(transform.rotation);

  // Calculates the new world rotation from the parent's world rotation.
  const finalQuaternion = parentInverseQuaternion.multiply(childWorldQuaternion);
  const finalRotation = new THREE.Euler().setFromQuaternion(finalQuaternion);

  return {
    position: finalPosition,
    rotation: finalRotation,
    scale: transform.scale,
  };
};

/**
 * Finds a parent that is allowed to have child nodes.
 * @param {THREE.Object3D} object the starting target
 * @returns {THREE.Object3D | undefined} the object that can be a parent or undefined.
 */
export const findNearestViableParentAncestorNodeRef = (object?: THREE.Object3D): THREE.Object3D | undefined => {
  if (!object) return;

  let parent: THREE.Object3D | null = object;
  while (parent) {
    if (isViableParent(parent)) return parent;
    parent = parent.parent;
  }

  return undefined;
};

/**
 * Creates a new scene node from new widget info attaching an appropriate transform.
 * @param newWidget the new widget node information
 * @param position the position to place the item
 * @param normal the normal to the surface
 * @param parent (Optional) parent to attach to
 * @returns the new scene node
 */
export const createNodeWithPositionAndNormal = (
  newWidget: AddingWidgetInfo,
  position: THREE.Vector3,
  normal: THREE.Vector3,
  parent?: THREE.Object3D,
): ISceneNodeInternal => {
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
};

/**
 * Creates a new scene node with a specified position rotation and scale
 * @param {AddingWidgetInfo} newWidget
 * @param {THREE.Vector3} position
 * @param {THREE.Euler} rotation
 * @param {Vector3} scale
 * @param {THREE.Object3D} parent
 * @returns {ISceneNodeInternal}
 */
export const createNodeWithTransform = (
  newWidget: AddingWidgetInfo | ISceneNodeInternal,
  position: THREE.Vector3,
  rotation: THREE.Euler,
  scale: THREE.Vector3,
  parent?: THREE.Object3D,
): ISceneNodeInternal => {
  const finalTransform = getFinalTransform({ position, rotation, scale }, parent);

  const node = (newWidget as AddingWidgetInfo).node ? (newWidget as AddingWidgetInfo).node : newWidget;
  return {
    ...node,
    transform: {
      position: finalTransform.position.toArray(),
      rotation: finalTransform.rotation.toVector3().toArray(),
      scale: scale.toArray(),
    },
  } as ISceneNodeInternal;
};

export const isEnvironmentNode = (node?: ISceneNodeInternal): boolean => {
  return (
    (findComponentByType(node, KnownComponentType.ModelRef) as IModelRefComponentInternal)?.modelType ===
    ModelType.Environment
  );
};
