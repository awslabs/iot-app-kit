import * as THREE from 'three';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { invalidate, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { MAX_CLICK_DISTANCE } from '../../../common/constants';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { Vector3, KnownComponentType } from '../../../interfaces';
import { IModelRefComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../store';
import { appendFunction } from '../../../utils/objectUtils';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import {
  acceleratedRaycasting,
  cloneMaterials,
  enableShadow,
  getComponentGroupName,
} from '../../../utils/objectThreeUtils';
import { getScaleFactor } from '../../../utils/mathUtils';
import { getIntersectionTransform } from '../../../utils/raycastUtils';
import {
  createNodeWithPositionAndNormal,
  findComponentByType,
  findNearestViableParentAncestorNodeRef,
} from '../../../utils/nodeUtils';
import { GLTFLoadingManager } from '../../../common/loadingManagers';

import { useGLTF } from './GLTFLoader';

import { getFaces } from '../../../utils/faceSelectionUtils';

function processObject(component: IModelRefComponentInternal, obj: THREE.Object3D, options: { maxAnisotropy: number }) {
  cloneMaterials(obj);
  acceleratedRaycasting(obj);
  enableShadow(component, obj, options.maxAnisotropy);
  obj.userData.isOriginal = true; // This is important to the SubModelSelection tool, it's used to filter out geomtry we've added with our
  obj.userData.componentRef = component.ref;
}

interface GLTFModelProps {
  node: ISceneNodeInternal;
  component: IModelRefComponentInternal;
  hiddenWhileImmersive: boolean;
}

export const GLTFModelComponent: React.FC<GLTFModelProps> = ({
  node,
  component,
  hiddenWhileImmersive,
}: GLTFModelProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const log = useLifecycleLogging('GLTFModelComponent');
  const { gl } = useThree();
  const maxAnisotropy = useMemo(() => gl.capabilities.getMaxAnisotropy(), []);
  const uriModifier = useStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const { getSceneNodeByRef } = useStore(sceneComposerId)((state) => state);
  const { isEditing, addingWidget, setAddingWidget, cursorLookAt, cursorVisible, setCursorVisible } =
    useEditorState(sceneComposerId);

  const [selectedVerticesArray, setSelectedVerticiesArray] = useState<Float32Array>();
  const [sharedWorldMatrix, setSharedWorldMatrix] = useState<THREE.Matrix4>();

  useEffect(() => {
    setCursorVisible(hiddenWhileImmersive || !!addingWidget);
  }, [hiddenWhileImmersive, addingWidget]);

  const gltf = useGLTF(
    component.uri,
    uriModifier,
    (loader) => {
      loader.manager = GLTFLoadingManager;

      loader.manager.onStart = appendFunction(loader.manager.onStart, () => {
        // Use setTimeout to avoid mutating the state during rendering process
        setTimeout(() => {
          useStore(sceneComposerId).getState().setLoadingModelState(true);
        }, 0);
      });
      loader.manager.onLoad = appendFunction(loader.manager.onLoad, () => {
        // Use setTimeout to avoid mutating the state during rendering process
        setTimeout(() => {
          useStore(sceneComposerId).getState().setLoadingModelState(false);
        }, 0);
      });
      loader.manager.onError = appendFunction(loader.manager.onError, () => {
        // Use setTimeout to avoid mutating the state during rendering process
        setTimeout(() => {
          useStore(sceneComposerId).getState().setLoadingModelState(false);
        }, 0);
      });
    },
    (progressEvent) => {
      let contentLength = NaN;
      if (progressEvent.lengthComputable) {
        contentLength = progressEvent.total;
      }
      // @ts-ignore - __onDownloadProgress is injected in the LoadingProgress component
      const onDownloadingProgress = GLTFLoadingManager.__onDownloadProgress;

      if (onDownloadingProgress) {
        const target = progressEvent.target as XMLHttpRequest;
        // target should never be falsy
        if (target) {
          onDownloadingProgress(target.responseURL, progressEvent.loaded, contentLength);
        } else {
          log?.error('Unexpected error. target is not a valid XMLHttpRequest');
        }
      }
    },
  ) as GLTF;

  const clonedModelScene = useMemo(() => {
    const result = SkeletonUtils.clone(gltf.scene);
    result.traverse((obj) => processObject(component, obj, { maxAnisotropy }));
    if (result.animations.length == 0) {
      gltf.animations?.forEach((element) => {
        result.animations.push(element);
      });
    }
    invalidate();
    return result;
  }, [gltf, component]);

  useFrame(() => {
    // TODO: Optimize this loop. Currently, the shadow setting is not applied when only setting in the clonedModelScene
    // creation function. To work around the issue, we'll update the shadow setting for each render loop.
    clonedModelScene.traverse((obj) => {
      enableShadow(component, obj, maxAnisotropy);

      if ((obj as THREE.Mesh).material) {
        const mesh = obj as THREE.Mesh;

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            material.colorWrite = !hiddenWhileImmersive;
          });
        } else {
          (mesh.material as THREE.Material).colorWrite = !hiddenWhileImmersive;
        }
      }
    });

    if (!addingWidget && cursorVisible) {
      setCursorVisible(false);
    }
  });

  let scale: Vector3 = [1, 1, 1];
  if (component.localScale) {
    scale = component.localScale;
  } else if (component.unitOfMeasure) {
    const factor = getScaleFactor(component.unitOfMeasure, 'meters');
    scale = [factor, factor, factor];
  }

  const handleAddWidget = (e: ThreeEvent<MouseEvent>) => {
    if (addingWidget) {
      const hierarchicalParent = findNearestViableParentAncestorNodeRef(e.eventObject);
      const hierarchicalParentNode = getSceneNodeByRef(hierarchicalParent?.userData.nodeRef);
      let physicalParent = hierarchicalParent;
      if (findComponentByType(hierarchicalParentNode, KnownComponentType.SubModelRef)) {
        while (physicalParent) {
          if (physicalParent.userData.componentTypes?.includes(KnownComponentType.ModelRef)) break;
          physicalParent = physicalParent.parent as THREE.Object3D<Event>;
        }
      }
      const { position } = getIntersectionTransform(e.intersections[0]);
      const newWidgetNode = createNodeWithPositionAndNormal(
        addingWidget,
        position,
        cursorLookAt,
        physicalParent,
        hierarchicalParent?.userData.nodeRef,
      );

      setAddingWidget(undefined);
      appendSceneNode(newWidgetNode);
      e.stopPropagation();
    }
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta <= MAX_CLICK_DISTANCE && isEditing() && addingWidget) {
      handleAddWidget(e);
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
        
        //first try is non-indexed buffer

        //doing index would let us prevent duplicate triangles on multiclick with a hashmap of
        //face indexes from the original mesh
        //const newGeometry = new THREE.BufferGeometry();

        //probably needs a world transform adjustment if not identity...
        const array = getFaces(geometry,brushSphere, mesh.matrixWorld);
        setSelectedVerticiesArray(array);

        //hide the model so we can see the result in dollhouse/floorplan (doesn't hide in explore)
        if(array) {
          const forcedMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00, opacity: 0.1, transparent:true});
          object.material = forcedMaterial;
          object.material.needsUpdate = true;
          setSharedWorldMatrix(mesh.matrixWorld);
        }

      }
    }
  }

  return (
    <group name={getComponentGroupName(node.ref, 'GLTF_MODEL')} scale={scale} dispose={null}>
      <primitive object={clonedModelScene} onClick={onClickMeshBrush /*onClick*/} />
      {selectedVerticesArray && <mesh 
            /*position={[0, 0, 0]}*/
            /*matrixWorld={sharedWorldMatrix}*/
            name='Selected Faces'>
              <bufferGeometry attach="geometry">
                <bufferAttribute 
                  attach="attributes-position"
                  array={selectedVerticesArray}
                  count={selectedVerticesArray.length / 3}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshStandardMaterial color={0xffffff} />
          </mesh>

          }
    </group>
  );
};

export const ErrorModelComponent: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color='red' />
    </mesh>
  );
};
