import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';
import * as THREE from 'three';

import { TopBar } from '../../../src/components/panels/TopBar';
import { useStore } from '../../../src/store';
import {
  COMPOSER_FEATURES,
  DEFAULT_CAMERA_OPTIONS,
  DEFAULT_CAMERA_POSITION,
  KnownComponentType,
  setFeatureConfig,
} from '../../../src';
import useActiveCamera from '../../../src/hooks/useActiveCamera';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

jest.mock('../../../src/hooks/useActiveCamera', () =>
  jest.fn().mockReturnValue({ setActiveCameraSettings: jest.fn() }),
);

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
    const polarisWrapper = wrapper(container);

    const dropDown = polarisWrapper.findButtonDropdown('[data-testid="view-options"]');
    dropDown?.openDropdown();
    const item = dropDown?.findItemById(KnownComponentType.MotionIndicator);

    // has no icon
    expect(item?.find('svg')).toBeNull();
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
    const polarisWrapper = wrapper(container);

    const dropDown = polarisWrapper.findButtonDropdown('[data-testid="view-options"]');
    dropDown?.openDropdown();
    let item = dropDown?.findItemById(KnownComponentType.MotionIndicator);

    // has checked icon
    expect(item?.find('[data-testid="CheckedIcon"]')).toBeDefined();

    item?.click();
    dropDown?.openDropdown();
    item = dropDown?.findItemById(KnownComponentType.MotionIndicator);

    expect(item?.find('svg')).toBeTruthy();
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

    const { container } = render(<TopBar />);
    const polarisWrapper = wrapper(container);

    const dropDown = polarisWrapper.findButtonDropdown('[data-testid="camera-views"]');
    dropDown?.openDropdown();
    const item = dropDown?.findItemById('camera-uuid');

    item?.click();

    expect(setActiveCameraSettings).toBeCalledWith(
      {
        ...cameraSettings,
        transform: {
          position: object3D.getWorldPosition(new THREE.Vector3()).toArray(),
          rotation: new THREE.Euler()
            .setFromQuaternion(object3D.getWorldQuaternion(new THREE.Quaternion()))
            .toVector3()
            .toArray(),
          scale: object3D.getWorldScale(new THREE.Vector3()).toArray(),
        },
      },
      'transition',
      true,
    );
  });
});
