import { useContext, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

import { Vector3 } from '../interfaces';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { ISceneNodeInternal, useEditorState } from '../store';

const COMPONENT_KEYNAME = 'COMPONENT';

function getBox3FromObject(obj: THREE.Object3D) {
  const box3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  const mesh = getComponentMesh(obj);
  mesh && box3.setFromObject(mesh);
  return box3;
}

function getComponentMesh(obj: THREE.Object3D) {
  const component = obj.children.find((child) => child.name.includes(COMPONENT_KEYNAME));
  let mesh: THREE.Mesh | undefined;

  component?.traverse((child) => {
    if (!mesh && child instanceof THREE.Mesh) {
      mesh = child;
    }
  });

  return mesh;
}

export function snapObjectToFloor(obj: THREE.Object3D, parentObj?: THREE.Object3D): Vector3 {
  const objBoxMinY = new THREE.Box3().setFromObject(obj).min.y;
  const objOriginYOffset = Math.abs(obj.getWorldPosition(new THREE.Vector3()).y - objBoxMinY);
  let floorY = objOriginYOffset;

  if (parentObj) {
    const parentBoxMinY = getBox3FromObject(parentObj).min.y;
    floorY = parentObj.worldToLocal(new THREE.Vector3(0, parentBoxMinY + objOriginYOffset, 0)).y;
  }

  return [obj.position.x, floorY, obj.position.z];
}

/**
 * Custom hook that wraps `snapObjectToFloor`.
 *
 * Because constraints require updated geometry to be enforced, each transform update occurs in two passes: 1) wait for
 * the app state and THREE scene to update with the latest transform change and 2) apply the constraint. Because we
 * cannot observe the THREE render loop from this context, we set `Object3D#onAfterRender` on the `node` mesh.
 *
 * @returns Function for triggering the application of the constraint if enabled on the Model.
 */
export function useSnapObjectToFloor(
  callback: (floorPosition: Vector3, node: ISceneNodeInternal) => void,
  node?: ISceneNodeInternal,
) {
  const sceneComposerId = useContext(sceneComposerIdContext);

  const { getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const nodeObject3D = node && getObject3DBySceneNodeRef(node.ref);
  const [state, setState] = useState(false);

  const parentObject3D = useMemo(() => {
    if (node?.parentRef) {
      return getObject3DBySceneNodeRef(node.parentRef);
    }
  }, [node]);

  function applyConstraint() {
    setState(true);
  }

  useEffect(() => {
    if (state) {
      setState(false);

      if (node?.transformConstraint.snapToFloor && nodeObject3D) {
        const mesh = getComponentMesh(nodeObject3D);

        if (mesh) {
          // delay onAfterRender callback until next tick to allow scene to update transformed geometries
          setTimeout(() => {
            mesh.onAfterRender = () => {
              nodeObject3D && callback(snapObjectToFloor(nodeObject3D, parentObject3D), node);
              mesh.onAfterRender = () => {};
            };
          }, 0);
        }
      }
    }
  }, [state, node, nodeObject3D, parentObject3D]);

  return applyConstraint;
}
