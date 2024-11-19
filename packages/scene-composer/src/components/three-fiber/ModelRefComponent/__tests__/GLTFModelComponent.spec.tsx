/* eslint-disable */
import * as THREE from 'three';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useThree } from '@react-three/fiber';
import { IModelRefComponentInternal, accessStore } from '../../../../store';
import { GLTFModelComponent } from '../GLTFModelComponent';
import { KnownComponentType } from '../../../..';
import { getScaleFactor } from '../../../../utils/mathUtils';
import Mock = vi.Mock;

vi.useFakeTimers();

const mockThreeStates = {
  gl: {
    capabilities: {
      getMaxAnisotropy: vi.fn(),
    },
  },
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
};

const mockUseFrame = vi.fn();
vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: vi.fn(),
    useFrame: mockUseFrame,
  };
});

vi.mock('../GLTFLoader', async () => {
  const originalModule = await vi.importActual('../GLTFLoader');
  return {
    ...originalModule,
    useGLTF: vi.fn(),
  };
});

const mockEnableShadow = vi.fn();
vi.mock('../../../../utils/objectThreeUtils', async () => {
  const originalModule = await vi.importActual('../../../../utils/objectThreeUtils');
  return {
    ...originalModule,
    acceleratedRaycasting: vi.fn(),
    deepClonedeepClone: vi.fn(),
    enableShadow: mockEnableShadow,
  };
});
// @ts-ignore
vi.mock('scheduler', () => require('scheduler/unstable_mock'));

/* eslint-enable */

describe('GLTFLoader', () => {
  const mockStoreUriModifier = vi.fn();
  const mockSetLoadingModelState = vi.fn();

  const baseState: any = {
    getEditorConfig: () => ({ uriModifier: mockStoreUriModifier }),
    setLoadingModelState: mockSetLoadingModelState,
  };
  const baseNode: any = {
    ref: 'mock-node',
  };
  const baseComponent: IModelRefComponentInternal = {
    ref: 'mock-comp',
    type: KnownComponentType.ModelRef,
    uri: 'mock/uri',
    modelType: 'GLB',
  };
  const mockObject = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  const baseScene = new THREE.Group();
  baseScene.add(mockObject);

  const setup = () => {
    vi.resetAllMocks();

    const useThreeMock = useThree as Mock;
    useThreeMock.mockReturnValue(mockThreeStates);

    mockUseGLTF.mockImplementation((_p, _u, _e, _o) => {
      return { scene: baseScene };
    });

    mockUseFrame.mockImplementation((cb) => cb());
  };

  beforeEach(() => {
    setup();
  });

  it('should call enableShadow in useFrame', async () => {
    accessStore('default').setState(baseState);

    const rendered = await ReactThreeTestRenderer.create(
      <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
    );

    // cloned - different id, but same geometry
    expect(rendered.scene.children[0].instance.children[0].children[0].uuid).not.toEqual(baseScene.children[0].uuid);
    expect((rendered.scene.children[0].instance.children[0].children[0] as THREE.Mesh).geometry).toEqual(
      (baseScene.children[0] as THREE.Mesh).geometry,
    );
  });
  describe('useGLTF', () => {
    let path;
    let gl;
    let extensionsCb;
    let uriModifier;
    let onProgressCb;

    beforeEach(() => {
      setup();

      mockUseGLTF.mockImplementation((p, g, u, e, o) => {
        path = p;
        gl = g;
        extensionsCb = e;
        uriModifier = u;
        onProgressCb = o;
        return { scene: new THREE.Group() };
      });
    });

    it('should be called with correct path and uriModifier', async () => {
      accessStore('default').setState(baseState);

      await ReactThreeTestRenderer.create(
        <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
      );

      expect(mockUseGLTF.mock.calls[0]).toMatchSnapshot();
    });
    describe('scale', () => {
      beforeEach(() => {
        setup();
      });

      it('should use defalt scale when component does not specify it', async () => {
        accessStore('default').setState(baseState);

        const rendered = await ReactThreeTestRenderer.create(
          <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
        );

        expect(Object.values(rendered.scene.children[0]._fiber.scale)).toEqual([1, 1, 1]);
      });

      it('should use local scale set in component', async () => {
        accessStore('default').setState(baseState);
        const expected: any = [2, 3, 4];

        const rendered = await ReactThreeTestRenderer.create(
          <GLTFModelComponent
            node={baseNode}
            component={{ ...baseComponent, localScale: expected }}
            hiddenWhileImmersive={false}
          />,
        );

        expect(Object.values(rendered.scene.children[0]._fiber.scale)).toEqual(expected);
      });

      it('should return correct scale for centimeter', async () => {
        accessStore('default').setState(baseState);
        const scale = getScaleFactor('centimeters', 'meters');
        const expected: any = [scale, scale, scale];

        const rendered = await ReactThreeTestRenderer.create(
          <GLTFModelComponent
            node={baseNode}
            component={{ ...baseComponent, unitOfMeasure: 'centimeters' }}
            hiddenWhileImmersive={false}
          />,
        );

        expect(Object.values(rendered.scene.children[0]._fiber.scale)).toEqual(expected);
      });
    });

    it('should clone and attach the scene', async () => {
      accessStore('default').setState(baseState);
      mockThreeStates.gl.capabilities.getMaxAnisotropy.mockReturnValue(1);

      await ReactThreeTestRenderer.create(
        <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
      );

      expect(mockEnableShadow).toBeCalled();
      expect(mockEnableShadow).toBeCalledWith(baseComponent, expect.any(THREE.Object3D), 1);
    });

    // TODO: Add tests to send onPointerDown and onPointerUp and verify closet is passed to setViewpointNodeRef Similarly to ViewCursorWidget

    // TODO: Add tests to send onPointerDown, onPointerMove and onPointerUp while adding and verify correct functions are executed
  });
});
