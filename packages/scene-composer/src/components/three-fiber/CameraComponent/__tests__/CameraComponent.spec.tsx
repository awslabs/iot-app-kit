import React from 'react';
import { render } from '@testing-library/react';
import { useThree } from '@react-three/fiber';

import { ICameraComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../../store';
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

describe('CameraComponent', () => {
  const node = { ref: 'testRef' } as ISceneNodeInternal;
  const isEditing = jest.fn();

  beforeEach(() => {
    const mockState = { isEditing: true, isLoadingModel: false };

    const useStoreMock = useStore as Mock;
    useStoreMock.mockReturnValue({ getState: jest.fn(() => mockState) });

    const useThreeMock = useThree as Mock;
    useThreeMock.mockReturnValue({ width: 1920, height: 1080 });

    const useEditorStateMock = useEditorState as Mock;
    useEditorStateMock.mockReturnValue({ isEditing });

    jest.clearAllMocks();
  });

  it('should render correctly for perspective camera', () => {
    isEditing.mockReturnValue(true);
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });

  it('should render as default correctly for perspective camera in viewing mode', () => {
    isEditing.mockReturnValue(false);
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
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
      cameraType: 'Orthographic',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });
});
