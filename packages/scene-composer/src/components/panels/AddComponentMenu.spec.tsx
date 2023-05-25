import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { setFeatureConfig, setMetricRecorder } from '../../common/GlobalSettings';
import { COMPOSER_FEATURES, KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';
import { useStore } from '../../store';
import { AddComponentMenu } from './AddComponentMenu';

describe('AddComponentMenu', () => {
  const addComponentInternal = jest.fn();
  const updateComponentInternal = jest.fn();
  const getSceneNodeByRef = jest.fn();
  const selectedSceneNodeRef = 'test-ref';
  const mockMetricRecorder = {
    recordClick: jest.fn(),
  };
  setMetricRecorder(mockMetricRecorder);

  beforeEach(() => {
    jest.clearAllMocks();

    useStore('default').setState({
      selectedSceneNodeRef,
      addComponentInternal,
      updateComponentInternal,
      getSceneNodeByRef,
    });
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true, [COMPOSER_FEATURES.DataBinding]: true });
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
    const addButton = screen.getByTestId('add-component-data-binding');

    act(() => {
      fireEvent.pointerUp(addButton);
    });

    expect(addComponentInternal).toBeCalledWith(selectedSceneNodeRef, {
      ref: expect.any(String),
      type: KnownComponentType.DataBinding,
      valueDataBinding: { dataBindingContext: {} },
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-component-data-binding');
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
    expect(screen.getByTestId('add-component-data-binding')).not.toBeNull();
    screen.getByTestId('add-component-data-binding').click();
    fireEvent.mouseOver(screen.getByTestId('add-component'));
    expect(addComponentInternal).not.toBeCalled();
    expect(mockMetricRecorder.recordClick).not.toBeCalledWith('add-component-data-binding');
  });

  it('should not see add data binding item when feature is not enabled', () => {
    setFeatureConfig({ [COMPOSER_FEATURES.DataBinding]: false });
    render(<AddComponentMenu />);
    expect(screen.queryByTestId('add-data-binding')).toBeNull();
  });
});
