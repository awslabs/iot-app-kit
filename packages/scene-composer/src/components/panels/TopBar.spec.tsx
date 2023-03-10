import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import * as THREE from 'three';

// eslint-disable-next-line import/order
import { TopBar } from './TopBar';
import { useStore } from '../../store';
import {
  COMPOSER_FEATURES,
  DEFAULT_CAMERA_OPTIONS,
  DEFAULT_CAMERA_POSITION,
  KnownComponentType,
  setFeatureConfig,
} from '../..';
import useActiveCamera from '../../hooks/useActiveCamera';

jest.mock('../../hooks/useActiveCamera', () => jest.fn().mockReturnValue({ setActiveCameraSettings: jest.fn() }));

const toggleMotionIndicatorVisibilityMock = jest.fn();
const cameraSettings = {
  cameraType: 'Perspective',
  fov: DEFAULT_CAMERA_OPTIONS.fov,
  far: DEFAULT_CAMERA_OPTIONS.far,
  near: DEFAULT_CAMERA_OPTIONS.near,
  zoom: 1,
};
const cameraComponent = {
  ...cameraSettings,
  type: KnownComponentType.Camera,
};

const cameraNode = {
  ref: 'camera-uuid',
  name: 'Camera',
  transform: {
    position: DEFAULT_CAMERA_POSITION,
  },
  components: [cameraComponent],
};

const node = {
  ref: 'test-uuid',
  name: 'Model',
  transform: {
    position: [1, 1, 1],
  },
  components: [{ type: KnownComponentType.ModelRef }],
};

const object3D = new THREE.Object3D();
object3D.position.set(5, 5, 5);
object3D.rotation.set(0, 0, 0);
object3D.scale.set(1, 1, 1);

const getObject3DBySceneNodeRef = jest.fn().mockReturnValue(object3D);
const getComponentRefByType = jest.fn();

const baseState = {
  noHistoryStates: {
    motionIndicatorVisible: true,
    toggleMotionIndicatorVisibility: toggleMotionIndicatorVisibilityMock,
  },
  getSceneNodeByRef: jest.fn().mockReturnValue(cameraNode),
  getObject3DBySceneNodeRef,
  getComponentRefByType,
  document: {
    nodeMap: {
      'test-uuid': node,
    },
  },
} as any;

describe('<TopBar />', () => {
  it('should render with motion indicator off option', () => {
    getComponentRefByType.mockReturnValue({ type: KnownComponentType.MotionIndicator });
    useStore('default').setState({
      ...baseState,
      noHistoryStates: {
        motionIndicatorVisible: false,
      },
    } as any);

    const { container } = render(<TopBar />);

    expect(container).toMatchSnapshot();
  });

  it('should not render without motion indicator or camera view', () => {
    getComponentRefByType.mockReturnValue({});
    useStore('default').setState(baseState);

    const { container } = render(<TopBar />);
    expect(container).toMatchSnapshot();
  });

  it('should render View Options Drop down with motion indicator', () => {
    getComponentRefByType.mockReturnValue({ type: KnownComponentType.MotionIndicator });
    useStore('default').setState({ ...baseState });

    const { container } = render(<TopBar />);
    expect(container).toMatchSnapshot();
  });

  it('should render Cameras Drop down with camera view', () => {
    getComponentRefByType.mockReturnValue({});
    const document = {
      nodeMap: {
        'camera-uuid': cameraNode,
      },
    };

    useStore('default').setState({ ...baseState, document });

    const { container } = render(<TopBar />);
    expect(container).toMatchSnapshot();
  });

  it('should render both drop downs with motion indicator and camera view', () => {
    getComponentRefByType.mockReturnValue({ type: KnownComponentType.MotionIndicator });
    const document = {
      nodeMap: {
        'camera-uuid': cameraNode,
      },
    };

    useStore('default').setState({ ...baseState, document });

    const { container } = render(<TopBar />);
    expect(container).toMatchSnapshot();
  });

  it('should toggle motion indicator visibility', () => {
    getComponentRefByType.mockReturnValue({ type: KnownComponentType.MotionIndicator });
    useStore('default').setState(baseState);

    const { container } = render(<TopBar />);

    const item = container.querySelector(`#${KnownComponentType.MotionIndicator}`);

    fireEvent.click(item!);

    expect(toggleMotionIndicatorVisibilityMock).toBeCalled();
  });

  it('should call setActiveCameraSettings when camera clicked', () => {
    getComponentRefByType.mockReturnValue({});
    const document = {
      nodeMap: {
        'camera-uuid': cameraNode,
      },
    };

    useStore('default').setState({ ...baseState, document });
    setFeatureConfig({ [COMPOSER_FEATURES.CameraView]: true });
    const { setActiveCameraSettings } = useActiveCamera();

    const { getByTestId } = render(<TopBar />);

    const dropdown = getByTestId('camera-views');
    const item = dropdown?.querySelector('#camera-uuid');

    fireEvent.click(item!);

    const arg = (setActiveCameraSettings as jest.Mock).mock.calls[0][0];

    expect(arg).toMatchInlineSnapshot(`
      Object {
        "cameraType": "Perspective",
        "far": 1000,
        "fov": 53.13,
        "near": 0.1,
        "transform": Object {
          "position": Array [
            5,
            5,
            5,
          ],
          "rotation": Array [
            -0,
            0,
            -0,
          ],
          "scale": Array [
            1,
            1,
            1,
          ],
        },
        "zoom": 1,
      }
    `);
  });
});
