import * as THREE from 'three';
import { useContext, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import useLogger from '../logger/react-logger/hooks/useLogger';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { ISceneNodeInternal, IViewpointComponentInternal, useEditorState, useSceneDocument } from '../store';
import { Viewpoint } from '../augmentations/three';
import { findComponentByType } from '../utils/nodeUtils';
import { KnownComponentType } from '../interfaces';
import {
  generateCubeMapSkyboxTexture,
  generateSixSidedSkyboxTexture,
} from '../components/three-fiber/immersive-view/ImmersiveViewUtils';

const DEFAULT_MAX_DISTANCE = 10;

export default function usePreloadSkyboxImages(maxDistance = DEFAULT_MAX_DISTANCE) {
  const log = useLogger('usePreloadSkyboxImages');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { selectedViewpointNodeRef, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef } = useSceneDocument(sceneComposerId);

  const { scene } = useThree();

  const loadImages = (node?: ISceneNodeInternal) => {
    if (!node) return;

    const viewpointComponent = findComponentByType(node, KnownComponentType.Viewpoint) as IViewpointComponentInternal;
    if (!viewpointComponent) return;

    switch (viewpointComponent.skyboxImageFormat) {
      case 'SixSided':
        generateSixSidedSkyboxTexture(viewpointComponent.skyboxImages).then(
          () => {
            log?.verbose(`Images preloaded for ${node.name}`);
          },
          () => {
            log?.warn(`Could not preload images for ${node.name}`);
          },
        );
        break;

      case 'CubeMap':
        generateCubeMapSkyboxTexture(viewpointComponent.skyboxImages[0]).then(
          () => {
            log?.verbose(`Images preloaded for ${node.name}`);
          },
          () => {
            log?.warn(`Could not preload images for ${node.name}`);
          },
        );
        break;

      default:
        log?.verbose('Unknown image format for preloading');
        break;
    }
  };

  const unCacheImages = (node?: ISceneNodeInternal) => {
    if (!node) return;

    log?.verbose(`Uncaching images for ${node.name}`);
    const viewpointComponent = findComponentByType(node, KnownComponentType.Viewpoint) as IViewpointComponentInternal;
    viewpointComponent?.skyboxImages.forEach((image) => {
      THREE.Cache.remove(image);
    });
  };

  useEffect(() => {
    const selectedViewpoint = getObject3DBySceneNodeRef(selectedViewpointNodeRef);
    const selectedViewpointNode = getSceneNodeByRef(selectedViewpointNodeRef);

    if (!selectedViewpoint || !selectedViewpointNode) return;

    // Perform preload on Images only when viewpoint changes
    const viewpoints: Viewpoint[] = [];

    scene.traverse((object) => {
      if (object instanceof Viewpoint) {
        viewpoints.push(object as Viewpoint);
      }
    });

    const currentPosition = new THREE.Vector3(); // Reused for optimization
    const selectedPosition = selectedViewpoint.getWorldPosition(new THREE.Vector3());

    // Get all viewpoints within range except for the selected viewpoint
    const viewpointsWithinRange = viewpoints.filter((viewpoint) => {
      return (
        viewpoint.getWorldPosition(currentPosition).distanceTo(selectedPosition) <= maxDistance &&
        viewpoint.id !== selectedViewpoint.id
      );
    });

    // Load the selected Viewpoint first
    loadImages(selectedViewpointNode);

    log?.verbose(`Preloading  ${viewpointsWithinRange.length} viewpoints`);
    viewpointsWithinRange.forEach((viewpoint) => {
      loadImages(getSceneNodeByRef(viewpoint.userData.nodeRef));
    });

    return () => {
      // Clean up Viewpoints that have fallen outside of range if already cached
      const viewpointsOutsideRange = viewpoints.filter((viewpoint) => {
        return viewpoint.getWorldPosition(currentPosition).distanceTo(selectedPosition) > maxDistance;
      });

      log?.verbose(`Cleaning up ${viewpointsOutsideRange.length} viewpoints`);
      viewpointsOutsideRange.forEach((viewpoint) => {
        unCacheImages(getSceneNodeByRef(viewpoint.userData.nodeRef));
      });
    };
  }, [selectedViewpointNodeRef]);
}
