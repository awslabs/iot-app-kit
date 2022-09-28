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
const node = {
  ref: 'test-uuid',
  name: 'Camera',
  transform: {
    position: DEFAULT_CAMERA_POSITION,
  },
  components: [cameraComponent],
};

const object3D = new THREE.Object3D();
object3D.position.set(5, 5, 5);
object3D.rotation.set(0, 0, 0);
object3D.scale.set(1, 1, 1);
const getObject3DBySceneNodeRef = jest.fn().mockReturnValue(object3D);

const baseState = {
  motionIndicatorVisible: true,
  toggleMotionIndicatorVisibility: toggleMotionIndicatorVisibilityMock,
  document: {
    nodeMap: {
      'test-uuid': node,
    },
  },
  getSceneNodeByRef: jest.fn().mockReturnValue(node),
  getObject3DBySceneNodeRef,
};

describe('<TopBar />', () => {
  it('should render with motion indicator off option', () => {
    useStore('default').setState({ noHistoryStates: { ...baseState, motionIndicatorVisible: false } });

    const { container } = render(<TopBar />);
    const polarisWrapper = wrapper(container);

    const dropDown = polarisWrapper.findButtonDropdown('[data-testid="view-options"]');
    dropDown?.openDropdown();
    const item = dropDown?.findItemById(KnownComponentType.MotionIndicator);

    // has no icon
    expect(item?.find('svg')).toBeNull();
  });

  it('should toggle motion indicator visibility', () => {
    useStore('default').setState({ noHistoryStates: baseState });

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
    useStore('default').setState(baseState as any);
    setFeatureConfig({ [COMPOSER_FEATURES.CameraView]: true });
    const { setActiveCameraSettings } = useActiveCamera();

    const { container } = render(<TopBar />);
    const polarisWrapper = wrapper(container);

    const dropDown = polarisWrapper.findButtonDropdown('[data-testid="camera-views"]');
    dropDown?.openDropdown();
    const item = dropDown?.findItemById('test-uuid');

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
