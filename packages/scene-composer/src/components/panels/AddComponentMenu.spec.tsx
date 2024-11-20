import { act, fireEvent, render, screen } from '@/tests/testing-library';

import { setMetricRecorder } from '../../common/GlobalSettings';
import { KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';
import { accessStore } from '../../store';

import { AddComponentMenu } from './AddComponentMenu';

describe('AddComponentMenu', () => {
  const addComponentInternal = vi.fn();
  const updateComponentInternal = vi.fn();
  const getSceneNodeByRef = vi.fn();
  const selectedSceneNodeRef = 'test-ref';
  const mockMetricRecorder = {
    recordClick: vi.fn(),
  };
  setMetricRecorder(mockMetricRecorder);

  beforeEach(() => {
    vi.clearAllMocks();

    accessStore('default').setState({
      selectedSceneNodeRef,
      addComponentInternal,
      updateComponentInternal,
      getSceneNodeByRef,
    });
  });

  it('should show add overlay for Tag node without overlay and call addComponentInternal when clicked', () => {
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          ref: expect.any(String),
          type: KnownComponentType.Tag,
        },
      ],
    });

    render(<AddComponentMenu />);
    const addOverlayButton = screen.getByTestId('add-component-overlay');

    act(() => {
      fireEvent.pointerUp(addOverlayButton);
    });

    expect(addComponentInternal).toBeCalledWith(
      selectedSceneNodeRef,
      expect.objectContaining({
        type: KnownComponentType.DataOverlay,
        subType: Component.DataOverlaySubType.OverlayPanel,
      }),
    );
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-component-overlay');
  });

  it('should disable add overlay for Tag node with overlay', () => {
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          ref: expect.any(String),
          type: KnownComponentType.Tag,
        },
        {
          ref: expect.any(String),
          type: KnownComponentType.DataOverlay,
        },
      ],
    });

    render(<AddComponentMenu />);
    const addOverlayButton = screen.getByTestId('add-component-overlay');

    act(() => {
      fireEvent.pointerUp(addOverlayButton);
    });

    expect(addComponentInternal).not.toBeCalled();
    expect(mockMetricRecorder.recordClick).not.toBeCalled();
  });

  it('should add data binding component to selected node when clicked', () => {
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          ref: expect.any(String),
          type: KnownComponentType.Tag,
        },
      ],
    });
    render(<AddComponentMenu />);
    const addButton = screen.getByTestId('add-component-entity-binding');

    act(() => {
      fireEvent.pointerUp(addButton);
    });

    expect(addComponentInternal).toBeCalledWith(selectedSceneNodeRef, {
      ref: expect.any(String),
      type: KnownComponentType.EntityBinding,
      valueDataBinding: { dataBindingContext: undefined },
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-component-entity-binding');
  });

  it('should add no addition binding to data binding component when clicked', () => {
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          ref: expect.any(String),
          type: KnownComponentType.Tag,
        },
      ],
    });
    render(<AddComponentMenu />);
    expect(screen.getByTestId('add-component-entity-binding')).not.toBeNull();
    screen.getByTestId('add-component-entity-binding').click();
    fireEvent.mouseOver(screen.getByTestId('add-component'));
    expect(addComponentInternal).not.toBeCalled();
    expect(mockMetricRecorder.recordClick).not.toBeCalledWith('add-component-entity-binding');
  });
});
