import React from 'react';
import * as THREE from 'three';
import { render } from '@testing-library/react';
import { useThree } from '@react-three/fiber';

import { ICameraComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../../store';
import useActiveCamera from '../../../../hooks/useActiveCamera';
import CameraComponent from '..';

import Mock = jest.Mock;

jest.mock('../../../../store', () => {
  const originalModule = jest.requireActual('../../../../store');
  return {
    ...originalModule,
    useStore: jest.fn(),
    useSceneDocument: jest.fn(() => ({ document: { defaultCameraRef: { ref: 'testCamera' } } })),
    useEditorState: jest.fn(),
  };
});

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useFrame: jest.fn().mockImplementation((callback) => callback()),
  };
});

jest.mock('@react-three/drei/core/useHelper', () => {
  const originalModule = jest.requireActual('@react-three/drei/core/useHelper');
  return {
    ...originalModule,
    useHelper: jest.fn(() => ({})),
  };
});

jest.mock('../../../../hooks/useSelectedNode', () => {
  return jest.fn().mockReturnValue({
    selectedSceneNodeRef: 'testRef',
  });
});

jest.mock('../../../../hooks/useActiveCamera', () => {
  return jest.fn();
});

describe('CameraComponent', () => {
  const node = {
    ref: 'testRef',
    name: 'testCamera',
    transform: {
      position: [5, 5, 5],
    },
  } as ISceneNodeInternal;
  const isEditing = jest.fn();
  const isViewing = jest.fn();
  const object3D = new THREE.Object3D();
  object3D.position.set(5, 5, 5);
  object3D.rotation.set(0, 0, 0);
  object3D.scale.set(1, 1, 1);

  beforeEach(() => {
    const mockState = { isEditing: true, isLoadingModel: false };

    const useStoreMock = useStore as Mock;
    useStoreMock.mockReturnValue({ getState: jest.fn(() => mockState) });

    const useThreeMock = useThree as Mock;
    useThreeMock.mockReturnValue({ width: 1920, height: 1080 });

    const useEditorStateMock = useEditorState as Mock;
    useEditorStateMock.mockReturnValue({
      isEditing,
      isViewing,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(object3D),
    });

    jest.clearAllMocks();
  });

  it('should render correctly for perspective camera', () => {
    isEditing.mockReturnValue(true);
    (useActiveCamera as jest.Mock).mockReturnValue({
      activeCameraSettings: {
        cameraType: 'Perspective',
        fov: 100,
        far: 50,
        near: 0.2,
        transform: {
          position: [5, 5, 5],
        },
      },
      setActiveCameraSettings: jest.fn(),
    });
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
    expect(useActiveCamera().setActiveCameraSettings).not.toBeCalled();
  });

  it('should render as default correctly for perspective camera in viewing mode', () => {
    isEditing.mockReturnValue(false);
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly for orthographic camera', () => {
    isEditing.mockReturnValue(true);
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Orthographic',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });

  it('should call setActiveCameraSettings if activeCameraName matches the name of the node', () => {
    isEditing.mockReturnValue(true);
    (useActiveCamera as jest.Mock).mockReturnValue({
      activeCameraSettings: {
        cameraType: 'Perspective',
        fov: 100,
        far: 50,
        near: 0.2,
        transform: {
          position: [5, 5, 5],
        },
      },
      setActiveCameraSettings: jest.fn(),
      activeCameraName: 'testCamera',
    });
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    render(<CameraComponent node={node} component={component} />);
    expect(useActiveCamera().setActiveCameraSettings).toBeCalledWith({
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
      transform: {
        position: object3D.getWorldPosition(new THREE.Vector3()).toArray(),
        rotation: new THREE.Euler()
          .setFromQuaternion(object3D.getWorldQuaternion(new THREE.Quaternion()))
          .toVector3()
          .toArray(),
        scale: object3D.getWorldScale(new THREE.Vector3()).toArray(),
      },
    });
  });
});
