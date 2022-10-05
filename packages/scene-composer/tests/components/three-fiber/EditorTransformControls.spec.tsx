/* eslint-disable */
import React from 'react';
import { act, render } from '@testing-library/react';

import { MockTransformControls } from '../../__mocks__/MockTransformControls';

import Mock = jest.Mock;

const mockThreeStates = {
  gl: {
    domElement: document.createElement('canvas'),
  },
  camera: {
    type: 'PerspectiveCamera',
  },
};
jest.doMock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
  };
});

const mockSnapToFloor = jest.fn();
jest.doMock('../../../src/three/transformUtils', () => {
  const originalModule = jest.requireActual('../../../src/three/transformUtils');
  return {
    ...originalModule,
    snapObjectToFloor: mockSnapToFloor,
  };
});

jest.doMock('../../../src/three/TransformControls', () => {
  const originalModule = jest.requireActual('../../../src/three/TransformControls');
  return {
    ...originalModule,
    TransformControls: MockTransformControls,
  };
});

const mockFindComponentByType = jest.fn();
const mockisEnvironmentNode = jest.fn();
jest.doMock('../../../src/utils/nodeUtils', () => {
  return {
    findComponentByType: mockFindComponentByType,
    isEnvironmentNode: mockisEnvironmentNode,
  };
});

import { EditorTransformControls } from '../../../src/components/three-fiber/EditorTransformControls';
import { useStore } from '../../../src/store';
import { KnownComponentType, TransformControlMode } from '../../../src';

import { useThree } from '@react-three/fiber';
import { Component, ModelType } from '../../../src/models/SceneModels';
/* eslint-enable */

describe('EditorTransformControls', () => {
  const mockSetTransformControls = jest.fn();
  const mockGetSceneNodeByRef = jest.fn();
  const mockGetObject3DBySceneNodeRef = jest.fn();
  const mockUpdateSceneNodeInternal = jest.fn();

  const baseState = {
    transformControlMode: 'translate' as TransformControlMode,
    setTransformControls: mockSetTransformControls,
    selectedSceneNodeRef: 'mock-selected-scene-node-ref',
    getSceneNodeByRef: mockGetSceneNodeByRef,
    getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
    updateSceneNodeInternal: mockUpdateSceneNodeInternal,
  };

  const setup = () => {
    jest.clearAllMocks();

    const useThreeMock = useThree as Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });
  };

  beforeEach(() => {
    setup();
  });

  describe('mouseUp event listener', () => {
    const mockTransformControlObject = {
      position: {
        x: 111,
        y: 222,
        z: 333,
      },
      rotation: {
        x: 11,
        y: 22,
        z: 33,
      },
      scale: {
        x: 1,
        y: 2,
        z: 3,
      },
    };
    const mockTransformBase = {
      position: Object.values(mockTransformControlObject.position),
      rotation: Object.values(mockTransformControlObject.rotation),
      scale: Object.values(mockTransformControlObject.scale),
    };

    beforeEach(() => {
      setup();
    });

    it('should add and remove mouseUp event listener', async () => {
      useStore('default').setState(baseState);
      let handler = null;
      MockTransformControls.addEventListener.mockImplementation((_, cb) => {
        handler = cb;
      });

      const renderer = render(<EditorTransformControls />);

      expect(MockTransformControls.addEventListener).toBeCalledTimes(1);
      expect(MockTransformControls.addEventListener).toBeCalledWith('mouseUp', handler);

      act(() => {
        renderer.unmount();
      });

      expect(MockTransformControls.removeEventListener).toBeCalledTimes(1);
      expect(MockTransformControls.removeEventListener).toBeCalledWith('mouseUp', handler);
    });

    it('should not call updateSceneNodeInternal when selected scene node is not found on mouseUp event', async () => {
      useStore('default').setState(baseState);
      let handler;
      MockTransformControls.addEventListener.mockImplementation((_, cb) => {
        handler = cb;
      });
      mockGetSceneNodeByRef.mockReturnValue(undefined);

      render(<EditorTransformControls />);
      MockTransformControls.instance.object = mockTransformControlObject;
      handler?.();

      expect(mockUpdateSceneNodeInternal).not.toBeCalled();
    });

    it('should call updateSceneNodeInternal with expected data when snapToFloor is false on mouseUp event', async () => {
      useStore('default').setState(baseState);
      let handler;
      MockTransformControls.addEventListener.mockImplementation((_, cb) => {
        handler = cb;
      });
      const mockNode = {
        ref: 'aaa',
        transformConstraint: {
          snapToFloor: false,
        },
        components: [],
      };
      mockGetSceneNodeByRef.mockReturnValue(mockNode);
      const expected = {
        transform: mockTransformBase,
      };

      render(<EditorTransformControls />);
      MockTransformControls.instance.object = mockTransformControlObject;
      handler?.();

      expect(mockSnapToFloor).not.toBeCalled();
      expect(mockUpdateSceneNodeInternal).toBeCalledTimes(1);
      expect(mockUpdateSceneNodeInternal).toBeCalledWith(mockNode.ref, expected);
    });

    it('should call updateSceneNodeInternal with expected data when snapToFloor is true on mouseUp event', async () => {
      useStore('default').setState({
        ...baseState,
        selectedSceneNodeRef: 'aaa',
      });
      let handler;
      MockTransformControls.addEventListener.mockImplementation((_, cb) => {
        handler = cb;
      });
      const mockNode = {
        ref: 'aaa',
        parentRef: 'bbb',
        transformConstraint: {
          snapToFloor: true,
        },
      };
      const mockParentNode = {
        ref: 'bbb',
        transformConstraint: {
          snapToFloor: true,
        },
      };
      mockGetSceneNodeByRef.mockImplementation((ref) => {
        if (ref === 'aaa') {
          return mockNode;
        } else if (ref === 'bbb') {
          return mockParentNode;
        }
      });
      const mockParentObject = { id: 'parent-object' };
      mockGetObject3DBySceneNodeRef.mockReturnValue(mockParentObject);
      const mockPosition = [444, 555, 666];
      mockSnapToFloor.mockReturnValue(mockPosition);

      const expected = {
        transform: {
          ...mockTransformBase,
          position: mockPosition,
        },
      };

      render(<EditorTransformControls />);
      MockTransformControls.instance.object = mockTransformControlObject;
      handler?.();

      expect(mockSnapToFloor).toBeCalledTimes(1);
      expect(mockSnapToFloor).toBeCalledWith(mockTransformControlObject, mockParentObject);
      expect(mockUpdateSceneNodeInternal).toBeCalledTimes(1);
      expect(mockUpdateSceneNodeInternal).toBeCalledWith(mockNode.ref, expected);
    });
  });

  it('should set correct mode transformControls.showY value with props change for snapToFloor', () => {
    useStore('default').setState(baseState);
    mockGetSceneNodeByRef.mockReturnValue(undefined);

    // initial value is true
    const renderer = render(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(1);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('translate');

    // change to false when snap to floor is true and in translate mode
    useStore('default').setState({
      ...baseState,
      transformControlMode: 'translate',
    });
    const mockNode = {
      ref: 'aaa',
      transformConstraint: {
        snapToFloor: true,
      },
      components: [],
    };
    mockGetSceneNodeByRef.mockReturnValue(mockNode);
    renderer.rerender(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeFalsy();
    expect(MockTransformControls.setMode).toBeCalledTimes(1);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('translate');

    // change to true when snap to floor is true and in rotate mode
    useStore('default').setState({
      ...baseState,
      transformControlMode: 'rotate',
    });
    mockGetSceneNodeByRef.mockReturnValue(mockNode);
    renderer.rerender(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(2);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('rotate');

    // change to true when snap to floor is false
    useStore('default').setState({
      ...baseState,
      transformControlMode: 'translate',
    });
    mockGetSceneNodeByRef.mockReturnValue({ ...mockNode, transformConstraint: { snapToFloor: false } });
    renderer.rerender(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(3);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('translate');
  });

  it('should set correct mode transformControls.showY value for LinearPlane motion indicator', () => {
    useStore('default').setState(baseState);
    mockGetSceneNodeByRef.mockReturnValue(undefined);

    // initial value is true
    const renderer = render(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(1);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('translate');

    // change to false for LinearPlane motion indicator in scale control mode
    useStore('default').setState({
      ...baseState,
      transformControlMode: 'scale',
    });
    const mockNode = {
      ref: 'aaa',
      transformConstraint: {
        snapToFloor: false,
      },
      components: [
        {
          type: KnownComponentType.MotionIndicator,
          shape: Component.MotionIndicatorShape.LinearPlane,
        },
      ],
    };
    mockGetSceneNodeByRef.mockReturnValue(mockNode);
    renderer.rerender(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeFalsy();
    expect(MockTransformControls.setMode).toBeCalledTimes(2);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('scale');

    // change to true when in rotate mode
    useStore('default').setState({
      ...baseState,
      transformControlMode: 'rotate',
    });
    mockGetSceneNodeByRef.mockReturnValue(mockNode);
    renderer.rerender(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(3);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('rotate');
  });

  it("should set transform controls's camera", async () => {
    useStore('default').setState(baseState);

    render(<EditorTransformControls />);

    expect(mockSetTransformControls).toBeCalledTimes(1);
    expect(mockSetTransformControls).toBeCalledWith(MockTransformControls.instance);
    expect(MockTransformControls.instance.camera).toBe(mockThreeStates.camera);
  });

  it('should attach and detach 3d object of the selected scene node', async () => {
    useStore('default').setState(baseState);
    const mockObject = { id: 'mock-object' };
    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);

    const renderer = render(<EditorTransformControls />);

    // attach
    expect(MockTransformControls.attach).toBeCalledTimes(1);
    expect(MockTransformControls.attach).toBeCalledWith(mockObject);
    expect(MockTransformControls.detach).toBeCalledTimes(0);

    useStore('default').setState({
      ...baseState,
      selectedSceneNodeRef: undefined,
    });
    renderer.rerender(<EditorTransformControls />);

    // detach
    expect(MockTransformControls.detach).toBeCalledTimes(1);
  });

  it('should attach and detach 3d object when adding a widget', async () => {
    useStore('default').setState(baseState);
    const mockObject = { id: 'mock-object' };
    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);

    const renderer = render(<EditorTransformControls />);

    // attach
    expect(MockTransformControls.attach).toBeCalledTimes(1);
    expect(MockTransformControls.attach).toBeCalledWith(mockObject);
    expect(MockTransformControls.detach).toBeCalledTimes(0);

    useStore('default').setState({
      ...baseState,
      addingWidget: {},
    } as any);
    renderer.rerender(<EditorTransformControls />);

    // detach
    expect(MockTransformControls.detach).toBeCalledTimes(1);
  });

  it('should not attach and detach to an node with an EnvironmentModelComponent', async () => {
    jest.clearAllMocks();
    useStore('default').setState(baseState);
    mockisEnvironmentNode.mockReturnValue(true);

    render(<EditorTransformControls />);

    // attach
    expect(MockTransformControls.attach).not.toHaveBeenCalled();
    expect(MockTransformControls.detach).toHaveBeenCalled();
  });
});
