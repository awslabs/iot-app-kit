/* eslint-disable import/first */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { SceneItemGroup } from '../../../../../src/components/toolbars/floatingToolbar/items';
import { useStore } from '../../../../../src/store';
import { COMPOSER_FEATURES, setFeatureConfig } from '../../../../../src';

describe('SceneItemGroup', () => {
  const cameraControlsType = 'orbit';
  const setCameraControlsType = jest.fn();

  beforeEach(() => {
    useStore('default').setState({
      cameraControlsType,
      setCameraControlsType,
    } as any);
    jest.clearAllMocks();
    setFeatureConfig({ [COMPOSER_FEATURES.IMMERSIVE_VIEW]: true });
  });

  it('should call setCameraControlsType when clicking pan', () => {
    render(<SceneItemGroup />);
    const sut = screen.getByTestId('camera-controls-pan');
    fireEvent.pointerUp(sut);
    expect(setCameraControlsType).toBeCalledWith('pan');
  });

  it('should call setCameraControlsType when clicking immersive', () => {
    render(<SceneItemGroup />);
    const sut = screen.getByTestId('camera-controls-immersive');
    fireEvent.pointerUp(sut);
    expect(setCameraControlsType).toBeCalledWith('immersive');
  });
});
