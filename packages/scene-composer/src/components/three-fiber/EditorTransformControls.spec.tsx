/* eslint-disable */
import { act, render } from '@/tests/testing-library';
import { MockTransformControls } from '../../../__mocks__/MockTransformControls';
import * as reactThree from '@react-three/fiber';
import { EditorTransformControls } from './EditorTransformControls';
import { ISceneNodeInternal, accessStore } from '../../store';
import { KnownComponentType, TransformControlMode } from '../..';
import { Component } from '../../models/SceneModels';

const mockThreeStates = {
  gl: {
    domElement: document.createElement('canvas'),
  },
  camera: {
    type: 'PerspectiveCamera',
  },
} as const;

vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: vi.fn(),
  };
});

const mockSnapToFloor = vi.fn();
vi.mock('../../../src/three/transformUtils', async () => {
  const originalModule = await vi.importActual('../../../src/three/transformUtils');
  return {
    ...originalModule,
    snapObjectToFloor: mockSnapToFloor,
  };
});

vi.mock('../../../src/three/TransformControls', async () => {
  const originalModule = await vi.importActual('../../../src/three/TransformControls');
  return {
    ...originalModule,
    TransformControls: MockTransformControls,
  };
});

const mockFindComponentByType = vi.fn();
vi.mock('../../../src/utils/nodeUtils', () => {
  return {
    findComponentByType: mockFindComponentByType,
  };
});

describe('EditorTransformControls', () => {
  const mockSetTransformControls = vi.fn();
  const mockGetSceneNodeByRef = vi.fn();
  const mockGetObject3DBySceneNodeRef = vi.fn();
  const mockUpdateSceneNodeInternal = vi.fn();
  const mockSetTransformControlMode = vi.fn();

  const baseState = {
    transformControlMode: 'translate' as TransformControlMode,
    setTransformControls: mockSetTransformControls,
    selectedSceneNodeRef: 'mock-selected-scene-node-ref',
    getSceneNodeByRef: mockGetSceneNodeByRef,
    getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
    updateSceneNodeInternal: mockUpdateSceneNodeInternal,
    setTransformControlMode: mockSetTransformControlMode,
  };

  const baseNode: ISceneNodeInternal = {
    ref: 'aaa',
    properties: {},
    childRefs: [],
    name: 'node-name',
    transform: {
      position: [1, 1, 1],
      rotation: [0, 0, 0],
      scale: [2, 2, 2],
    },
    transformConstraint: {
      snapToFloor: false,
    },
    components: [],
  };

  const setup = () => {
    vi.clearAllMocks();

    vi.spyOn(reactThree, 'useThree').mockImplementation((s) => {
      if (s) {
        return s(mockThreeStates as reactThree.RootState);
      }
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
      accessStore('default').setState(baseState);
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
      accessStore('default').setState(baseState);
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
      accessStore('default').setState(baseState);
      let handler;
      MockTransformControls.addEventListener.mockImplementation((_, cb) => {
        handler = cb;
      });
      mockGetSceneNodeByRef.mockReturnValue(baseNode);
      const expected = {
        transform: mockTransformBase,
      };

      render(<EditorTransformControls />);
      MockTransformControls.instance.object = mockTransformControlObject;
      handler?.();

      expect(mockSnapToFloor).not.toBeCalled();
      expect(mockUpdateSceneNodeInternal).toBeCalledTimes(1);
      expect(mockUpdateSceneNodeInternal).toBeCalledWith(baseNode.ref, expected);
    });

    it('should call updateSceneNodeInternal with expected data when snapToFloor is true on mouseUp event', async () => {
      accessStore('default').setState({
        ...baseState,
        selectedSceneNodeRef: 'aaa',
      });
      let handler;
      MockTransformControls.addEventListener.mockImplementation((_, cb) => {
        handler = cb;
      });
      const mockNode = {
        ...baseNode,
        parentRef: 'bbb',
        transformConstraint: {
          snapToFloor: true,
        },
      };
      const mockParentNode = {
        ...baseNode,
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
    accessStore('default').setState(baseState);
    mockGetSceneNodeByRef.mockReturnValue(undefined);

    // initial value is true
    const renderer = render(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(1);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('translate');

    // change to false when snap to floor is true and in translate mode
    accessStore('default').setState({
      ...baseState,
      transformControlMode: 'translate',
    });
    const mockNode = {
      ...baseNode,
      transformConstraint: {
        snapToFloor: true,
      },
    };
    mockGetSceneNodeByRef.mockReturnValue(mockNode);
    renderer.rerender(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeFalsy();
    expect(MockTransformControls.setMode).toBeCalledTimes(1);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('translate');

    // change to true when snap to floor is true and in rotate mode
    accessStore('default').setState({
      ...baseState,
      transformControlMode: 'rotate',
    });
    mockGetSceneNodeByRef.mockReturnValue(mockNode);
    renderer.rerender(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(2);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('rotate');

    // change to true when snap to floor is false
    accessStore('default').setState({
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
    accessStore('default').setState(baseState);
    mockGetSceneNodeByRef.mockReturnValue(undefined);

    // initial value is true
    const renderer = render(<EditorTransformControls />);
    expect(MockTransformControls.instance.showY).toBeTruthy();
    expect(MockTransformControls.setMode).toBeCalledTimes(1);
    expect(MockTransformControls.setMode).toHaveBeenLastCalledWith('translate');

    // change to false for LinearPlane motion indicator in scale control mode
    accessStore('default').setState({
      ...baseState,
      transformControlMode: 'scale',
    });
    const mockNode = {
      ...baseNode,
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
    accessStore('default').setState({
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
    accessStore('default').setState(baseState);

    render(<EditorTransformControls />);

    expect(mockSetTransformControls).toBeCalledTimes(1);
    expect(mockSetTransformControls).toBeCalledWith(MockTransformControls.instance);
    expect(MockTransformControls.instance.camera).toBe(mockThreeStates.camera);
  });

  it('should attach and detach 3d object of the selected scene node', async () => {
    accessStore('default').setState(baseState);
    const mockObject = { id: 'mock-object' };
    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);

    const renderer = render(<EditorTransformControls />);

    // attach
    expect(MockTransformControls.attach).toBeCalledTimes(1);
    expect(MockTransformControls.attach).toBeCalledWith(mockObject);
    expect(MockTransformControls.detach).toBeCalledTimes(0);

    accessStore('default').setState({
      ...baseState,
      selectedSceneNodeRef: undefined,
    });
    renderer.rerender(<EditorTransformControls />);

    // detach
    expect(MockTransformControls.detach).toBeCalledTimes(1);
  });

  it('should attach and detach 3d object when adding a widget', async () => {
    accessStore('default').setState(baseState);
    const mockObject = { id: 'mock-object' };
    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);

    const renderer = render(<EditorTransformControls />);

    // attach
    expect(MockTransformControls.attach).toBeCalledTimes(1);
    expect(MockTransformControls.attach).toBeCalledWith(mockObject);
    expect(MockTransformControls.detach).toBeCalledTimes(0);

    accessStore('default').setState({
      ...baseState,
      addingWidget: { node: baseNode },
    });
    renderer.rerender(<EditorTransformControls />);

    // detach
    expect(MockTransformControls.detach).toBeCalledTimes(1);
  });

  it('should flipY when selected node has overlay component', async () => {
    mockGetSceneNodeByRef.mockReturnValue({ ...baseNode, components: [{ type: KnownComponentType.DataOverlay }] });
    mockFindComponentByType.mockReturnValue({ type: KnownComponentType.DataOverlay });
    accessStore('default').setState(baseState);

    render(<EditorTransformControls />);

    expect(MockTransformControls.instance.flipY).toBeTruthy();
  });

  it('should set transform mode to translate when selected node has overlay component and current mode is rotate', async () => {
    mockGetSceneNodeByRef.mockReturnValue({ ...baseNode, components: [{ type: KnownComponentType.DataOverlay }] });
    mockFindComponentByType.mockReturnValue({ type: KnownComponentType.DataOverlay });
    accessStore('default').setState({ ...baseState, transformControlMode: 'rotate' });

    render(<EditorTransformControls />);

    expect(mockSetTransformControlMode).toBeCalledTimes(1);
    expect(mockSetTransformControlMode).toBeCalledWith('translate');
  });

  it('should set transform mode to translate when selected node has overlay component and current mode is scale', async () => {
    mockGetSceneNodeByRef.mockReturnValue({ ...baseNode, components: [{ type: KnownComponentType.DataOverlay }] });
    mockFindComponentByType.mockReturnValue({ type: KnownComponentType.DataOverlay });
    accessStore('default').setState({ ...baseState, transformControlMode: 'scale' });

    render(<EditorTransformControls />);

    expect(mockSetTransformControlMode).toBeCalledTimes(1);
    expect(mockSetTransformControlMode).toBeCalledWith('translate');
  });

  it('should set transform mode to translate when selected node has Tag component and current mode is rotate', async () => {
    mockGetSceneNodeByRef.mockReturnValue({ ...baseNode, components: [{ type: KnownComponentType.Tag }] });
    mockFindComponentByType.mockReturnValue({ type: KnownComponentType.Tag });
    accessStore('default').setState({ ...baseState, transformControlMode: 'rotate' });

    render(<EditorTransformControls />);

    expect(mockSetTransformControlMode).toBeCalledTimes(1);
    expect(mockSetTransformControlMode).toBeCalledWith('translate');
  });

  it('should set transform mode to translate when selected node has Tag component and current mode is scale', async () => {
    mockGetSceneNodeByRef.mockReturnValue({ ...baseNode, components: [{ type: KnownComponentType.Tag }] });
    mockFindComponentByType.mockReturnValue({ type: KnownComponentType.Tag });
    accessStore('default').setState({ ...baseState, transformControlMode: 'scale' });

    render(<EditorTransformControls />);

    expect(mockSetTransformControlMode).toBeCalledTimes(1);
    expect(mockSetTransformControlMode).toBeCalledWith('translate');
  });
});
