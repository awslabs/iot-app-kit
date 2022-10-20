/* eslint-disable import/first */
import React from 'react';
import * as THREE from 'three';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { CameraType } from '../../../models/SceneModels';
import { DEFAULT_CAMERA_SETTINGS } from '../../../common/constants';
import { ICameraComponentInternal, useStore } from '../../../store';
import { mockNode, mockComponent } from '../../../../tests/components/panels/scene-components/MockComponents';

import CameraComponentEditor from './CameraComponentEditor';

const mockParse = jest.fn((str: string, defaultValue: number) => {
  return 2;
});

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const updateComponentInternalFn = jest.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
};

describe('CameraComponentEditor', () => {
  const cameraComponent: ICameraComponentInternal = {
    ...mockComponent,
    cameraType: CameraType.Perspective,
    ...DEFAULT_CAMERA_SETTINGS,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update camera settings when selecting focal length', () => {
    useStore('default').setState(baseState);

    const { container } = render(<CameraComponentEditor node={mockNode} component={cameraComponent} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    const expectedCamera = new THREE.PerspectiveCamera(
      cameraComponent.fov,
      1,
      cameraComponent.near,
      cameraComponent.far,
    );
    expectedCamera.setFocalLength(35);

    select!.openDropdown();
    select!.selectOption(3);
    expect(updateComponentInternalFn).toHaveBeenCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        cameraType: CameraType.Perspective,
        fov: expectedCamera.getEffectiveFOV(),
        near: expectedCamera.near,
        far: expectedCamera.far,
        zoom: expectedCamera.zoom,
      },
      true,
    );
  });

  it('should update focal length when updating fov', () => {
    useStore('default').setState(baseState);

    const { container } = render(<CameraComponentEditor node={mockNode} component={cameraComponent} />);

    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.find('[data-testid="camera-fov-field"]')?.findInput();
    const select = polarisWrapper.findSelect();

    const expectedCamera = new THREE.PerspectiveCamera(
      cameraComponent.fov,
      1,
      cameraComponent.near,
      cameraComponent.far,
    );
    expectedCamera.fov = 30;

    expect(input).not.toBeUndefined();
    input!.focus();
    input!.setInputValue('30');
    input!.blur();
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        cameraType: CameraType.Perspective,
        fov: expectedCamera.getEffectiveFOV(),
        near: expectedCamera.near,
        far: expectedCamera.far,
        zoom: expectedCamera.zoom,
      },
      true,
    );

    const innerHTML = select.getElement().innerHTML;
    expect(innerHTML.includes(`${expectedCamera.getFocalLength().toFixed(2)}mm`)).toEqual(true);
  });

  it('should not update if FOV is below the minimum value', () => {
    useStore('default').setState(baseState);

    const { container } = render(<CameraComponentEditor node={mockNode} component={cameraComponent} />);

    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.find('[data-testid="camera-fov-field"]')?.findInput();

    expect(input).not.toBeUndefined();
    input!.focus();
    input!.setInputValue('1');
    input!.blur();
    expect(updateComponentInternalFn).not.toBeCalled();
  });

  it('should update camera node when updating far', () => {
    useStore('default').setState(baseState);

    const { container } = render(<CameraComponentEditor node={mockNode} component={cameraComponent} />);

    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.find('[data-testid="camera-far-field"]')?.findInput();

    const expectedCamera = new THREE.PerspectiveCamera(
      cameraComponent.fov,
      1,
      cameraComponent.near,
      cameraComponent.far,
    );
    expectedCamera.far = 500;

    expect(input).not.toBeUndefined();
    input!.focus();
    input!.setInputValue('500');
    input!.blur();
    expect(updateComponentInternalFn).toHaveBeenCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        cameraType: CameraType.Perspective,
        fov: expectedCamera.getEffectiveFOV(),
        near: expectedCamera.near,
        far: expectedCamera.far,
        zoom: expectedCamera.zoom,
      },
      true,
    );
  });

  it('should update camera node when updating near', () => {
    useStore('default').setState(baseState);

    const { container } = render(<CameraComponentEditor node={mockNode} component={cameraComponent} />);

    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.find('[data-testid="camera-near-field"]')?.findInput();

    const expectedCamera = new THREE.PerspectiveCamera(
      cameraComponent.fov,
      1,
      cameraComponent.near,
      cameraComponent.far,
    );
    expectedCamera.near = 0.1;

    expect(input).not.toBeUndefined();
    input!.focus();
    input!.setInputValue('0.1');
    input!.blur();
    expect(updateComponentInternalFn).toHaveBeenCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        cameraType: CameraType.Perspective,
        fov: expectedCamera.getEffectiveFOV(),
        near: expectedCamera.near,
        far: expectedCamera.far,
        zoom: expectedCamera.zoom,
      },
      true,
    );
  });

  it('should update camera node when updating zoom', () => {
    useStore('default').setState(baseState);

    const { container } = render(<CameraComponentEditor node={mockNode} component={cameraComponent} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.find('[data-testid="camera-zoom-field"]')?.findSelect();

    const expectedCamera = new THREE.PerspectiveCamera(
      cameraComponent.fov,
      1,
      cameraComponent.near,
      cameraComponent.far,
    );
    expectedCamera.zoom = 2;

    expect(select).not.toBeUndefined();
    select!.openDropdown();
    select!.selectOption(4);
    expect(updateComponentInternalFn).toHaveBeenCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        cameraType: CameraType.Perspective,
        fov: expectedCamera.getEffectiveFOV(),
        near: expectedCamera.near,
        far: expectedCamera.far,
        zoom: expectedCamera.zoom,
      },
      true,
    );
  });
});
