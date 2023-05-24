import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import { cleanup, renderHook } from '@testing-library/react-hooks';
import str2ab from 'string-to-arraybuffer';
import flushPromises from 'flush-promises';
import { Object3D, Event, Mesh, MeshBasicMaterial, Color } from 'three';

import { SceneComposerInternal, SceneComposerApi, useSceneComposerApi, COMPOSER_FEATURES, setFeatureConfig } from '..';
import { testScenes } from '../../tests/testData';

jest.mock('../layouts/StaticLayout', () => ({
  StaticLayout: 'StaticLayout',
}));

jest.mock((window as any).ResizeObserver, () => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));
jest.mock('resize-observer-polyfill', () => {
  return ResizeObserver;
});

const object3D = new Object3D<Event>();
const redColor = new Color('red');
const blueColor = new Color('blue');
const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: redColor }));
object3D.children.push(mesh);

const nodeMap = [
  {
    name: 'Water Tank',
    ref: 'waterTankRef',
    components: [
      {
        ref: 'bindComponentRef',
        type: 'DataBinding',
        valueDataBinding: {
          dataBindingContext: {
            entityId: 'WaterTank',
          },
        },
      },
    ],
  },
  {
    name: 'FlowMeter',
    ref: 'flowMeterRef',
    components: [
      {
        ref: 'fakeComponent',
        type: 'Camera',
        valueDataBinding: {},
      },
    ],
  },
];

jest.mock('../store', () => {
  const originalModule = jest.requireActual('../store');
  return {
    ...originalModule,
    useStore: jest.fn(() => {
      return {
        ...originalModule.useStore(),
        getState: jest.fn(() => {
          return {
            ...originalModule.useStore().getState(),
            document: {
              nodeMap: nodeMap,
            },
            getObject3DBySceneNodeRef: jest.fn(() => object3D),
          };
        }),
      };
    }),
  };
});

function createSceneLoaderMock(sceneContent: string) {
  return {
    getSceneUri: () => Promise.resolve('file://test.json'),
    getSceneUrl: () => Promise.resolve('file://test.json'),
    getSceneObject: () => Promise.resolve(str2ab(sceneContent)),
  };
}

describe('SceneComposerInternal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setFeatureConfig({ [COMPOSER_FEATURES.DataBinding]: true });
  });

  describe('useSceneComposerApi', () => {
    it('should return an api object', async () => {
      let sut: SceneComposerApi | null = null;

      const TestComponent = () => {
        const sceneComposerId = 'test';
        sut = useSceneComposerApi('test');

        return (
          <SceneComposerInternal
            sceneComposerId={sceneComposerId}
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(testScenes.scene1)}
          />
        );
      };

      await act(async () => {
        renderer.create(<TestComponent />);

        await flushPromises();
      });

      expect(sut).toHaveProperty('setCameraTarget');
    });

    it('should highlight and clear a scene node', async () => {
      const TestComponent = () => {
        const sceneComposerId = 'test';

        return (
          <SceneComposerInternal
            sceneComposerId={sceneComposerId}
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(testScenes.waterTank)}
          />
        );
      };

      await act(async () => {
        renderer.create(<TestComponent />);

        await flushPromises();
      });

      const composerApi = renderHook(() => useSceneComposerApi('test')).result.current;

      act(() => {
        composerApi.highlights([
          {
            dataBindingContext: {
              entityId: 'WaterTank',
            },
            style: {
              color: 'blue',
            },
          },
        ]);
      });
      expect(mesh.material.color.getHex()).toBe(blueColor.getHex());
      act(() => {
        composerApi.clearHighlights([
          {
            entityId: 'WaterTank',
          },
        ]);
      });
      expect(mesh.material.color.getHex()).toBe(redColor.getHex());

      cleanup();
    });
  });
});
