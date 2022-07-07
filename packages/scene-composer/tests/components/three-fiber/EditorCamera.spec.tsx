/* eslint-disable */
import { MockTransformControls } from '../../__mocks__/MockTransformControls';

import Mock = jest.Mock;

const mockThreeStates = {
  scene: {
    getObjectByName: jest.fn(),
  },
  set: jest.fn(),
};
const mockUseFrame = jest.fn();
jest.doMock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useFrame: mockUseFrame,
  };
});

const mockMapControls = jest.fn();
jest.doMock('../../../src/components/three-fiber/controls/MapControls', () => {
  const originalModule = jest.requireActual('../../../src/components/three-fiber/controls/MapControls');
  return {
    ...originalModule,
    MapControls: mockMapControls,
  };
});

const mockOrbitControls = jest.fn();
jest.doMock('../../../src/components/three-fiber/controls/OrbitControls', () => {
  const originalModule = jest.requireActual('../../../src/components/three-fiber/controls/OrbitControls');
  return {
    ...originalModule,
    OrbitControls: mockOrbitControls,
  };
});

const mockPerspectiveCamera = jest.fn();
jest.doMock('@react-three/drei/core/PerspectiveCamera', () => {
  const originalModule = jest.requireActual('@react-three/drei/core/PerspectiveCamera');
  return {
    ...originalModule,
    PerspectiveCamera: mockPerspectiveCamera,
  };
});

const mockMergeRefs = jest.fn();
jest.doMock('react-merge-refs', () => {
  return mockMergeRefs;
});

const mockSetTween = jest.fn();
const mockUpdateTween = jest.fn();
jest.doMock('../../../src/hooks', () => {
  const originalModule = jest.requireActual('../../../src/hooks');
  return {
    ...originalModule,
    useTween: () => [mockSetTween, mockUpdateTween],
  };
});

import * as React from 'react';
import * as THREE from 'three';

import { act, render } from '@testing-library/react';

import { EditorMainCamera, findBestViewingPosition } from '../../../src/components/three-fiber/EditorCamera';
import { useStore } from '../../../src/store';

import { useThree } from '@react-three/fiber';
/* eslint-enable */

describe('EditorMainCamera', () => {
  const mockGetObject3DBySceneNodeRef = jest.fn();

  const baseState: any = {
    cameraCommand: undefined,
    cameraControlsType: 'orbit',
    transformControls: new MockTransformControls({}, {}),
    getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
  };

  const setup = () => {
    jest.resetAllMocks();

    mockMapControls.mockReturnValue(<div data-testid={'map-control'} />);
    mockOrbitControls.mockReturnValue(<div data-testid={'orbit-control'} />);
    mockPerspectiveCamera.mockReturnValue(<div data-testid={'perspective-camera'} />);
    const useThreeMock = useThree as Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });
  };

  beforeEach(() => {
    setup();
  });

  describe('render', () => {
    beforeEach(() => {
      setup();
    });

    it('should render OrbitControl', async () => {
      useStore('default').setState(baseState);

      const rendered = render(<EditorMainCamera />);

      expect(rendered.queryByTestId('perspective-camera')).toBeTruthy();
      expect(rendered.queryByTestId('orbit-control')).toBeTruthy();
      expect(rendered.queryByTestId('map-control')).toBeFalsy();
    });

    it('should render MapControl', async () => {
      useStore('default').setState({ ...baseState, cameraControlsType: 'pan' });

      const rendered = render(<EditorMainCamera />);

      expect(rendered.queryByTestId('perspective-camera')).toBeTruthy();
      expect(rendered.queryByTestId('orbit-control')).toBeFalsy();
      expect(rendered.queryByTestId('map-control')).toBeTruthy();
    });

    it('should not render if ImmersiveViewControl', async () => {
      useStore('default').setState({ ...baseState, cameraControlsType: 'immersive' });

      const rendered = render(<EditorMainCamera />);

      expect(rendered.queryByTestId('perspective-camera')).toBeTruthy();
      expect(rendered.queryByTestId('orbit-control')).toBeFalsy();
      expect(rendered.queryByTestId('map-control')).toBeFalsy();
    });

    it('should not render control on mouseDown and render control on mouseUp', async () => {
      useStore('default').setState(baseState);
      let handler;
      MockTransformControls.addEventListener.mockImplementation((_, cb) => {
        handler = cb;
      });

      const rendered = render(<EditorMainCamera />);

      // initial state
      expect(rendered.queryByTestId('perspective-camera')).toBeTruthy();
      expect(rendered.queryByTestId('orbit-control')).toBeTruthy();
      expect(rendered.queryByTestId('map-control')).toBeFalsy();

      // mouseDown
      await act(async () => {
        handler({ type: 'mouseDown' });
        rendered.rerender(<EditorMainCamera />);
      });

      expect(rendered.queryByTestId('perspective-camera')).toBeTruthy();
      expect(rendered.queryByTestId('orbit-control')).toBeFalsy();
      expect(rendered.queryByTestId('map-control')).toBeFalsy();

      // mouseUp
      await act(async () => {
        handler({ type: 'mouseUp' });
        rendered.rerender(<EditorMainCamera />);
      });

      expect(rendered.queryByTestId('perspective-camera')).toBeTruthy();
      expect(rendered.queryByTestId('orbit-control')).toBeTruthy();
      expect(rendered.queryByTestId('map-control')).toBeFalsy();

      // unmount remove listener
      rendered.unmount();
      expect(MockTransformControls.removeEventListener).toBeCalledTimes(2);
    });
  });

  describe('cameraTarget', () => {
    const mockCamera = {
      position: new THREE.Vector3(1, 2, 3),
      layers: new THREE.Layers(),
    };

    beforeEach(() => {
      setup();
    });

    it('should setTween to default camera target on mount', async () => {
      useStore('default').setState(baseState);
      mockMergeRefs.mockImplementation((refs) => {
        if (refs[1]) refs[1].current = mockCamera;
      });
      let tweenPosition;
      let tweenTarget;
      mockSetTween.mockImplementation((position, target) => {
        tweenPosition = position;
        tweenTarget = target;
      });
      render(<EditorMainCamera />);

      expect(mockSetTween).toBeCalled();
      expect(tweenPosition.from).toEqual({ x: 1, y: 2, z: 3 });
      expect(tweenPosition.to).toEqual({ x: 5, y: 5, z: 5 });
      expect(tweenPosition.duration).toEqual(500);
      expect(tweenTarget.from).toEqual({ x: 0, y: 0, z: 0 });
      expect(tweenTarget.to).toEqual({ x: 0, y: 0, z: 0 });
      expect(tweenTarget.duration).toEqual(500);
    });

    it('should setTween to correct camera target when camera command changes to fixed camera target', async () => {
      useStore('default').setState(baseState);
      const setPositionSpy = jest.spyOn(mockCamera.position, 'set');
      mockMergeRefs.mockImplementation((refs) => {
        if (refs[1]) refs[1].current = mockCamera;
      });
      let tweenPosition;
      let tweenTarget;
      mockSetTween.mockImplementation((position, target) => {
        tweenPosition = position;
        tweenTarget = target;
      });
      const rendered = render(<EditorMainCamera />);

      await act(async () => {
        useStore('default').setState({
          ...baseState,
          cameraCommand: {
            target: {
              position: new THREE.Vector3(11, 22, 33),
              target: new THREE.Vector3(44, 55, 66),
            },
            mode: 'teleport',
          },
        });
        rendered.rerender(<EditorMainCamera />);
      });

      expect(tweenPosition.from).toEqual({ x: 1, y: 2, z: 3 });
      expect(tweenPosition.to).toEqual({ x: 11, y: 22, z: 33 });
      expect(tweenPosition.duration).toEqual(0);
      expect(tweenTarget.from).toEqual({ x: 0, y: 0, z: 0 });
      expect(tweenTarget.to).toEqual({ x: 44, y: 55, z: 66 });
      expect(tweenTarget.duration).toEqual(0);

      // onUpdate tween
      tweenPosition.onUpdate();
      expect(setPositionSpy).toBeCalledTimes(1);
      expect(setPositionSpy).toBeCalledWith(1, 2, 3);
    });

    it('should setTween to correct camera target when camera command changes to named camera target', async () => {
      useStore('default').setState(baseState);
      mockMergeRefs.mockImplementation((refs) => {
        if (refs[1]) refs[1].current = mockCamera;
      });
      let tweenPosition;
      let tweenTarget;
      mockSetTween.mockImplementation((position, target) => {
        tweenPosition = position;
        tweenTarget = target;
      });

      mockOrbitControls.mockImplementation((...a) => {
        return <div data-testid={'orbit-control'} />;
      });
      const rendered = render(<EditorMainCamera />);
      const mockObject = new THREE.Object3D();
      mockObject.applyMatrix4(new THREE.Matrix4().set(1, 0, 0, 4444, 0, 1, 0, 5555, 0, 0, 1, 6666, 0, 0, 0, 1));
      mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);

      await act(async () => {
        useStore('default').setState({
          ...baseState,
          cameraCommand: {
            target: 'mock-node',
            mode: 'transition',
          },
        });
        rendered.rerender(<EditorMainCamera />);
      });

      expect(tweenPosition.from).toEqual({ x: 1, y: 2, z: 3 });
      expect(tweenPosition.to).toEqual({ x: 5, y: 5, z: 5 }); // default position
      expect(tweenPosition.duration).toEqual(500);
      expect(tweenTarget.from).toEqual({ x: 0, y: 0, z: 0 });
      expect(tweenTarget.to).toEqual(mockObject.position);
      expect(tweenTarget.duration).toEqual(500);
    });
  });

  it('should call updateTweem with frame update', async () => {
    useStore('default').setState(baseState);
    let callback;
    mockUseFrame.mockImplementation((cb) => (callback = cb));

    render(<EditorMainCamera />);
    callback();

    expect(mockUpdateTween).toBeCalledTimes(1);
  });

  describe('findBestViewingPosition', () => {
    const mockObject = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    mockObject.applyMatrix4(new THREE.Matrix4().set(1, 0, 0, 4444, 0, 1, 0, 5555, 0, 0, 1, 6666, 0, 0, 0, 1));

    const mockCamera = new THREE.PerspectiveCamera(60, 0.75);
    mockCamera.position.copy(new THREE.Vector3(-1, -1, -1));
    const mockControls: any = {
      object: mockCamera,
    };

    // half length of unit vector divide by sin of half our smallest FOV axis for our box of size 1,1,1
    const minimumDistance = Math.sqrt(3) / 2 / Math.sin(0.5 * (Math.PI / 180) * 45);
    // min distance squared to give vector length and reverse Pythagorean theorem twice
    // x^2 + y^2 = xy^2 where y = x
    // x^2 +xy^2 = mindistance^2
    // via substitution: 3x^2 = mindistance^2 then solve for x
    const expectedVectorLength = Math.sqrt(Math.pow(minimumDistance, 2) / 3);

    beforeEach(() => {
      setup();
    });

    it('should return default position and object bounding box center when controls is undefined', () => {
      const result = findBestViewingPosition(mockObject, false);

      expect(result.position).toEqual([5, 5, 5]);
      expect(result.target).toEqual(Object.values(mockObject.position));
    });

    it('should return default position and object bounding box center when bounding box is infinite', () => {
      const object = new THREE.Object3D();
      const result = findBestViewingPosition(object, false, mockControls);

      expect(result.position).toEqual([5, 5, 5]);
      expect(result.target).toEqual(Object.values(object.position));
    });

    it('should not return default position and object bounding box center when bounding box has size 0', () => {
      const object = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
      const result = findBestViewingPosition(object, false, mockControls);

      expect(result.position).not.toEqual([5, 5, 5]);
      expect(result.target).toEqual(Object.values(object.position));
    });

    it('should initialize the position to the max point of the bounding box for initial case', () => {
      const spy = jest
        .spyOn(THREE.Box3.prototype, 'expandByScalar')
        .mockReturnValue(new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(7, 7, 7)));
      const result = findBestViewingPosition(mockObject, true, mockControls);

      expect(result.position[0]).toBeCloseTo(mockObject.position.x + expectedVectorLength, 5);
      expect(result.position[1]).toBeCloseTo(mockObject.position.y + expectedVectorLength, 5);
      expect(result.position[2]).toBeCloseTo(mockObject.position.z + expectedVectorLength, 5);
      expect(result.target).toEqual(Object.values(mockObject.position));
      spy.mockRestore();
    });

    it('should return the current camera position as position', () => {
      const spy = jest
        .spyOn(THREE.Box3.prototype, 'expandByScalar')
        .mockReturnValue(new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(7, 7, 7)));
      const result = findBestViewingPosition(mockObject, false, mockControls);

      expect(result.position).toEqual(mockCamera.position.toArray());
      expect(result.target).toEqual(Object.values(mockObject.position));
      spy.mockRestore();
    });

    it('should back the camera to the minimum distanct', () => {
      const spy = jest
        .spyOn(THREE.Box3.prototype, 'expandByScalar')
        .mockReturnValue(new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(7, 7, 7)));
      const mockObject = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xffff00 }),
      );
      const mockCamera = new THREE.PerspectiveCamera(60, 0.75);
      mockCamera.position.copy(new THREE.Vector3(0.1, 0.1, 0.1));
      const mockControls: any = {
        object: mockCamera,
      };
      const result = findBestViewingPosition(mockObject, false, mockControls);

      expect(result.position[0]).toBeCloseTo(expectedVectorLength, 5);
      expect(result.position[1]).toBeCloseTo(expectedVectorLength, 5);
      expect(result.position[2]).toBeCloseTo(expectedVectorLength, 5);
      expect(result.target).toEqual(Object.values(mockObject.position));
      spy.mockRestore();
    });
  });
});
