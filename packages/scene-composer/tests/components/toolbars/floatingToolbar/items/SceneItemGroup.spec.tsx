/* eslint-disable import/first */
import { fireEvent, render, screen } from '@testing-library/react';

import { ToolbarOrientation } from '../../../../../src/components/toolbars/common/types';
import { SceneItemGroup } from '../../../../../src/components/toolbars/floatingToolbar/items';
import { accessStore } from '../../../../../src/store';

describe('SceneItemGroup', () => {
  const cameraControlsType = 'orbit';
  const setCameraControlsType = vi.fn();

  beforeEach(() => {
    accessStore('default').setState({
      cameraControlsType,
      setCameraControlsType,
    } as any);
    viarAllMocks();
  });

  it('should call setCameraControlsType when clicking pan', () => {
    render(<SceneItemGroup toolbarOrientation={ToolbarOrientation.Vertical} canvasHeight={null} />);
    const sut = screen.getByTestId('camera-controls-pan');
    fireEvent.pointerUp(sut);
    expect(setCameraControlsType).toBeCalledWith('pan');
  });
});
