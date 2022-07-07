import * as THREE from 'three';
import React from 'react';
import { useThree } from '@react-three/fiber';
import { act, create } from 'react-test-renderer';

import usePreloadSkyboxImages from '../../src/hooks/usePreloadSkyboxImages';
import {
  generateCubeMapSkyboxTexture,
  generateSixSidedSkyboxTexture,
} from '../../src/components/three-fiber/immersive-view/ImmersiveViewUtils';
import { ISceneNodeInternal, IViewpointComponentInternal, useStore } from '../../src/store';
import { KnownComponentType, Viewpoint } from '../../src';

jest.mock('../../src/components/three-fiber/immersive-view/ImmersiveViewUtils', () => ({
  generateCubeMapSkyboxTexture: jest.fn().mockReturnValue(
    new Promise<void>((resolve, reject) => {
      resolve();
    }),
  ),
  generateSixSidedSkyboxTexture: jest.fn().mockReturnValue(
    new Promise<void>((resolve, reject) => {
      resolve();
    }),
  ),
}));

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
  };
});

describe('usePreloadSkyboxImages', () => {
  const MAX_DISTANCE = 10;
  const selectedViewpointNodeRef = 'selected-viewpoint';
  const viewpointHalfDistanceNodeRef = 'half-distance';
  const viewpointNegValueMaxDistanceNodeRef = 'neg-value-max-distance';
  const viewpointMaxDistanceNodeRef = 'max-distance';
  const viewpointOverDistanceNodeRef = 'over-distance';

  const viewpointNodes = [
    {
      ref: selectedViewpointNodeRef,
      components: [
        {
          type: KnownComponentType.Viewpoint,
          skyboxImageFormat: 'SixSided',
          skyboxImages: ['image1.png', 'image2.png'],
        },
      ],
    } as unknown as ISceneNodeInternal,
    {
      ref: viewpointHalfDistanceNodeRef,
      components: [
        {
          type: KnownComponentType.Viewpoint,
          skyboxImageFormat: 'CubeMap',
          skyboxImages: ['cubemap.png'],
        },
      ],
    } as unknown as ISceneNodeInternal,
    {
      ref: viewpointMaxDistanceNodeRef,
      components: [
        {
          type: KnownComponentType.Viewpoint,
          skyboxImageFormat: 'SixSided',
          skyboxImages: ['image3.png', 'image4.png'],
        },
      ],
    } as unknown as ISceneNodeInternal,
    {
      ref: viewpointOverDistanceNodeRef,
      components: [
        {
          type: KnownComponentType.Viewpoint,
          skyboxImageFormat: 'SixSided',
          skyboxImages: ['image5.png', 'image6.png'],
        },
      ],
    } as unknown as ISceneNodeInternal,
    // For Coverage
    {
      ref: viewpointNegValueMaxDistanceNodeRef,
      components: [
        {
          type: KnownComponentType.Viewpoint,
          skyboxImageFormat: 'Equirectangular',
          skyboxImages: ['image.png'],
        },
      ],
    } as unknown as ISceneNodeInternal,
  ];

  const scene = new THREE.Scene();
  const selectedViewpoint = new Viewpoint();
  selectedViewpoint.userData = { nodeRef: selectedViewpointNodeRef };
  const viewPointHalfDistance = new Viewpoint();
  viewPointHalfDistance.position.set(MAX_DISTANCE / 2, 0, 0);
  viewPointHalfDistance.userData = { nodeRef: viewpointHalfDistanceNodeRef };
  const viewpointNegValueMaxDistance = new Viewpoint();
  viewpointNegValueMaxDistance.position.set(-MAX_DISTANCE, 0, 0);
  viewpointNegValueMaxDistance.userData = { nodeRef: viewpointNegValueMaxDistanceNodeRef };
  const viewPointMaxDistance = new Viewpoint();
  viewPointMaxDistance.position.set(MAX_DISTANCE, 0, 0);
  viewPointMaxDistance.userData = { nodeRef: viewpointMaxDistanceNodeRef };
  const viewpointOverDistance = new Viewpoint();
  viewpointOverDistance.position.set(MAX_DISTANCE + 1, 0, 0);
  viewpointOverDistance.userData = { nodeRef: viewpointOverDistanceNodeRef };

  scene.add(selectedViewpoint);
  scene.add(viewPointHalfDistance);
  scene.add(viewPointMaxDistance);
  scene.add(viewpointOverDistance);
  scene.add(viewpointNegValueMaxDistance);

  const viewpointObject3DMap = new Map([
    [selectedViewpointNodeRef, selectedViewpoint],
    [viewpointHalfDistanceNodeRef, viewPointHalfDistance],
    [viewpointMaxDistanceNodeRef, viewPointMaxDistance],
    [viewpointOverDistanceNodeRef, viewpointNegValueMaxDistance],
  ]);

  beforeEach(() => {
    (useThree as jest.Mock).mockReturnValue({ scene });
    useStore('default').setState({
      selectedViewpointNodeRef,
      getObject3DBySceneNodeRef: jest.fn().mockImplementation((ref?: string) => {
        if (ref) {
          return viewpointObject3DMap.get(ref);
        }
      }),
      getSceneNodeByRef: jest.fn().mockImplementation((ref?: string) => {
        if (ref) {
          return viewpointNodes.filter((node) => {
            return node.ref === ref;
          })[0];
        }
      }),
    });

    jest.clearAllMocks();
  });

  it('should load textures for all viewpoint nodes within the desired range', () => {
    jest.spyOn(THREE.Cache, 'remove');
    const TestComponent = () => {
      usePreloadSkyboxImages(MAX_DISTANCE);

      return <></>;
    };

    let component;
    act(() => {
      component = create(<TestComponent />);
    });

    const mockGenerateSixSidedSkyboxTextures = generateSixSidedSkyboxTexture as jest.Mock;
    const mockGenerateCubeMapSkyboxTextures = generateCubeMapSkyboxTexture as jest.Mock;

    expect(mockGenerateSixSidedSkyboxTextures).toHaveBeenCalledWith(
      (viewpointNodes[0].components[0] as IViewpointComponentInternal).skyboxImages,
    );
    expect(mockGenerateCubeMapSkyboxTextures).toHaveBeenCalledWith(
      (viewpointNodes[1].components[0] as IViewpointComponentInternal).skyboxImages[0],
    );
    expect(mockGenerateSixSidedSkyboxTextures).toHaveBeenCalledWith(
      (viewpointNodes[2].components[0] as IViewpointComponentInternal).skyboxImages,
    );
    expect(mockGenerateSixSidedSkyboxTextures).not.toHaveBeenCalledWith(
      (viewpointNodes[3].components[0] as IViewpointComponentInternal).skyboxImages,
    );

    component.unmount();

    (viewpointNodes[3].components[0] as IViewpointComponentInternal).skyboxImages.forEach((image) => {
      expect(THREE.Cache.remove).toHaveBeenCalledWith(image);
    });
  });
});
