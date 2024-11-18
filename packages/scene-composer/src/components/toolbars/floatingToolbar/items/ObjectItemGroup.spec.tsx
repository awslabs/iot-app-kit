import { render, screen, fireEvent } from '@testing-library/react';

import { accessStore } from '../../../../store';
import { ToolbarOrientation } from '../../common/types';
import { isDynamicScene } from '../../../../utils/entityModelUtils/sceneUtils';

import { ObjectItemGroup } from '.';

jest.mock('../../../../utils/entityModelUtils/sceneUtils');

describe('ObjectItemGroup', () => {
  const removeSceneNode = jest.fn();
  const selectedSceneNodeRef = 'test-ref';
  const setTransformControlMode = jest.fn();
  const getSceneNodeByRef = jest.fn();
  const setDeleteConfirmationModalVisible = jest.fn();

  beforeEach(() => {
    accessStore('default').setState({
      selectedSceneNodeRef,
      removeSceneNode,
      transformControlMode: 'translate',
      setTransformControlMode,
      getSceneNodeByRef,
      setDeleteConfirmationModalVisible,
    });
    jest.clearAllMocks();

    (isDynamicScene as jest.Mock).mockReturnValue(false);
  });

  it('should call removeSceneNode when clicking delete with a selected node', () => {
    render(<ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('delete');
    fireEvent.pointerUp(sut);
    expect(removeSceneNode).toBeCalledWith(selectedSceneNodeRef);
  });

  it('should call setDeleteConfirmationModalVisible when clicking delete node in dynamic scene', () => {
    (isDynamicScene as jest.Mock).mockReturnValue(true);

    render(<ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('delete');
    fireEvent.pointerUp(sut);

    expect(removeSceneNode).not.toBeCalled();
    expect(setDeleteConfirmationModalVisible).toBeCalledTimes(1);
    expect(setDeleteConfirmationModalVisible).toBeCalledWith(true, {
      type: 'deleteNode',
      nodeRef: selectedSceneNodeRef,
    });
  });

  it('should not call removeSceneNode when clicking delete without a selected node', () => {
    accessStore('default').setState({
      selectedSceneNodeRef: undefined,
    });
    render(<ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('delete');
    fireEvent.pointerUp(sut);
    expect(removeSceneNode).not.toBeCalled();
  });

  it('should call setTransformControlMode when clicking rotate', () => {
    render(<ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('transform-rotate');
    fireEvent.pointerUp(sut);
    expect(setTransformControlMode).toBeCalledWith('rotate');
  });
});
