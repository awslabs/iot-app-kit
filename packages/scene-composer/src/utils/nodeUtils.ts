import * as THREE from 'three';

import { ISceneComponentInternal, ISceneNodeInternal } from '../store';
import { AddingWidgetInfo, KnownComponentType } from '../interfaces';
import { Vector3 } from '../models/SceneModels';
import { ITransformInternal } from '../store/internalInterfaces';

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

export type Transform = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
};

export const getFinalNodeScale = (node: ISceneNodeInternal | undefined, worldScale: THREE.Vector3): Vector3 => {
  // Scale of Tag component is independent of its ancestors, therefore keep its original value.
  return node && findComponentByType(node, KnownComponentType.Tag) ? node.transform.scale : worldScale.toArray();
};

/**
 * Get the final position and rotation from all the ancestors
 * @param {Transform} transform
 * @param {THREE.Object3D} parent
 * @returns {Transform} final transform based on all ancestors.
 */
export const getFinalTransform = (transform: Transform, parent?: THREE.Object3D | null): Transform => {
  if (!parent) return transform;

  const finalPosition = parent.worldToLocal(transform.position.clone());

  const parentInverseQuaternion = parent.getWorldQuaternion(new THREE.Quaternion()).invert();
  const childWorldQuaternion = new THREE.Quaternion().setFromEuler(transform.rotation);

  // Calculates the new world rotation from the parent's world rotation.
  const finalQuaternion = parentInverseQuaternion.multiply(childWorldQuaternion);
  const finalRotation = new THREE.Euler().setFromQuaternion(finalQuaternion);

  const parentWorldScale = parent.getWorldScale(new THREE.Vector3());

  return {
    position: finalPosition,
    rotation: finalRotation,
    scale: transform.scale.divide(parentWorldScale),
  };
};

/**
 * Get the final position and rotation from all the ancestors for the node
 * @param {ISceneNodeInternal} object
 * @param {THREE.Object3D} object3D
 * @param {THREE.Object3D} parent
 * @returns {ITransformInternal} final transform for node.
 */
export const getFinalNodeTransform = (
  object: Readonly<ISceneNodeInternal> | undefined,
  object3D: THREE.Object3D,
  parent?: THREE.Object3D | null,
): ITransformInternal => {
  const worldPosition = object3D.getWorldPosition(new THREE.Vector3());
  const worldRotation = new THREE.Euler().setFromQuaternion(object3D.getWorldQuaternion(new THREE.Quaternion()));
  const worldScale = object3D.getWorldScale(new THREE.Vector3());

  const transform: Transform = {
    position: worldPosition,
    rotation: worldRotation,
    scale: worldScale,
  };

  const finalTransform = getFinalTransform(transform, parent);

  const finalScale = getFinalNodeScale(object, finalTransform.scale);

  return {
    position: finalTransform.position.toArray(),
    rotation: [finalTransform.rotation.x, finalTransform.rotation.y, finalTransform.rotation.z],
    scale: finalScale,
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
  targetRef?: string,
): ISceneNodeInternal => {
  const finalPosition = parent?.worldToLocal(position.clone()) ?? position;
  return {
    ...newWidget.node,
    parentRef: targetRef || parent?.userData.nodeRef,
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
  targetRef?: string,
): ISceneNodeInternal => {
  const finalTransform = getFinalTransform({ position, rotation, scale }, parent);

  const node = (newWidget as AddingWidgetInfo).node ? (newWidget as AddingWidgetInfo).node : newWidget;
  return {
    ...node,
    parentRef: targetRef || parent?.userData.nodeRef,
    transform: {
      position: finalTransform.position.toArray(),
      rotation: new THREE.Vector3().setFromEuler(finalTransform.rotation).toArray(),
      scale: scale.toArray(),
    },
  } as ISceneNodeInternal;
};
