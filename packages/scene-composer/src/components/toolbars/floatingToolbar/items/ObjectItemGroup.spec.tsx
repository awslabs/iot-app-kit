import { fireEvent, render, screen } from '@/tests/testing-library';

import { accessStore } from '../../../../store';
import { isDynamicScene } from '../../../../utils/entityModelUtils/sceneUtils';
import { ToolbarOrientation } from '../../common/types';

import { ObjectItemGroup } from '.';

vi.mock('../../../../utils/entityModelUtils/sceneUtils');

describe('ObjectItemGroup', () => {
  const removeSceneNode = vi.fn();
  const selectedSceneNodeRef = 'test-ref';
  const setTransformControlMode = vi.fn();
  const getSceneNodeByRef = vi.fn();
  const setDeleteConfirmationModalVisible = vi.fn();

  beforeEach(() => {
    accessStore('default').setState({
      selectedSceneNodeRef,
      removeSceneNode,
      transformControlMode: 'translate',
      setTransformControlMode,
      getSceneNodeByRef,
      setDeleteConfirmationModalVisible,
    });
    vi.clearAllMocks();

    (isDynamicScene as vi.Mock).mockReturnValue(false);
  });

  it('should call removeSceneNode when clicking delete with a selected node', () => {
    render(<ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('delete');
    fireEvent.pointerUp(sut);
    expect(removeSceneNode).toBeCalledWith(selectedSceneNodeRef);
  });

  it('should call setDeleteConfirmationModalVisible when clicking delete node in dynamic scene', () => {
    (isDynamicScene as vi.Mock).mockReturnValue(true);

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
