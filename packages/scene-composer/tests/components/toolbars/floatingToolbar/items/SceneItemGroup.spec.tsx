/* eslint-disable import/first */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { SceneItemGroup } from '../../../../../src/components/toolbars/floatingToolbar/items';
import { accessStore } from '../../../../../src/store';
import { ToolbarOrientation } from '../../../../../src/components/toolbars/common/types';

describe('SceneItemGroup', () => {
  const cameraControlsType = 'orbit';
  const setCameraControlsType = jest.fn();

  beforeEach(() => {
    accessStore('default').setState({
      cameraControlsType,
      setCameraControlsType,
    } as any);
    jest.clearAllMocks();
  });

  it('should call setCameraControlsType when clicking pan', () => {
    render(<SceneItemGroup toolbarOrientation={ToolbarOrientation.Vertical} canvasHeight={null} />);
    const sut = screen.getByTestId('camera-controls-pan');
    fireEvent.pointerUp(sut);
    expect(setCameraControlsType).toBeCalledWith('pan');
  });
});
