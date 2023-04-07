import { act, render } from '@testing-library/react';
import React from 'react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { useStore } from '../../../store';

import { OverlayPanelVisibilityToggle } from './OverlayPanelVisibilityToggle';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('OverlayPanelVisibilityToggle', () => {
  const setSceneProperty = jest.fn();
  const getSceneProperty = jest.fn();
  const getComponentRefByType = jest.fn();
  const getSceneNodeByRef = jest.fn();
  const isViewing = jest.fn();

  const createState = (visible: boolean) => ({
    noHistoryStates: {
      ...useStore('default').getState().noHistoryStates,
      componentVisibilities: { [Component.DataOverlaySubType.OverlayPanel]: visible },
    },
    setSceneProperty,
    getSceneProperty,
    getComponentRefByType,
    getSceneNodeByRef,
    isViewing,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getSceneNodeByRef.mockReturnValue({
      components: [{ type: KnownComponentType.DataOverlay, subType: Component.DataOverlaySubType.OverlayPanel }],
    });
    getComponentRefByType.mockReturnValue({ ref: ['comp'] });
    useStore('default').setState(createState(true));
  });

  it('should update view option with document settings', () => {
    render(<OverlayPanelVisibilityToggle />);

    expect(
      useStore('default').getState().noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel],
    ).toBeFalsy();
  });

  it('should update scene property when toggled', () => {
    const { container } = render(<OverlayPanelVisibilityToggle />);
    const polarisWrapper = wrapper(container);
    const toggle = polarisWrapper.findToggle();

    expect(toggle).not.toBeNull();
    expect(
      useStore('default').getState().noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel],
    ).toBeFalsy();

    // Toggle to true
    act(() => {
      toggle!.findNativeInput().click();
    });

    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty).toBeCalledWith(KnownSceneProperty.ComponentSettings, {
      [KnownComponentType.DataOverlay]: { overlayPanelVisible: true },
    });
  });

  it('should not update view option with document settings in viewing mode', () => {
    isViewing.mockReturnValue(true);
    render(<OverlayPanelVisibilityToggle />);

    expect(
      useStore('default').getState().noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel],
    ).toBeTruthy();
  });

  it('should not update scene property when toggled in viewing mode', () => {
    isViewing.mockReturnValue(true);
    const { container } = render(<OverlayPanelVisibilityToggle />);
    const polarisWrapper = wrapper(container);
    const toggle = polarisWrapper.findToggle();

    expect(toggle).not.toBeNull();
    expect(
      useStore('default').getState().noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel],
    ).toBeTruthy();

    // Toggle to false
    act(() => {
      toggle!.findNativeInput().click();
    });

    expect(setSceneProperty).not.toBeCalled();
  });
});
