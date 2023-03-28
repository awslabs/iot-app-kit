import { renderHook } from '@testing-library/react';

import { IOverlaySettings } from '../interfaces';
import { Component } from '../models/SceneModels';
import { useStore } from '../store';
import { componentSettingsSelector } from '../utils/componentSettingsUtils';

import useOverlayVisible from './useOverlayVisible';

jest.mock('../utils/componentSettingsUtils');

describe('useOverlayVisible', () => {
  const isViewingMock = jest.fn();
  const documentSettings: IOverlaySettings = { overlayPanelVisible: true };
  const componentVisibilities = {
    [Component.DataOverlaySubType.OverlayPanel]: false,
    [Component.DataOverlaySubType.TextAnnotation]: true,
  };

  beforeEach(() => {
    (componentSettingsSelector as jest.Mock).mockReturnValue(documentSettings);
    useStore('default').setState({
      noHistoryStates: {
        ...useStore('default').getState().noHistoryStates,
        componentVisibilities,
      },
      isViewing: isViewingMock,
    });
    isViewingMock.mockReturnValue(true);
  });

  it('should get overlay panel visibility from document in editing mode', () => {
    isViewingMock.mockReturnValue(false);
    const visible = renderHook(() => useOverlayVisible(Component.DataOverlaySubType.OverlayPanel)).result.current;

    expect(visible).toBeTruthy();
  });

  it('should get overlay panel visibility from view options in viewing mode', () => {
    const visible = renderHook(() => useOverlayVisible(Component.DataOverlaySubType.OverlayPanel)).result.current;

    expect(visible).toBeFalsy();
  });

  it('should get annotation visibility as true', () => {
    isViewingMock.mockReturnValue(false);
    const visible = renderHook(() => useOverlayVisible(Component.DataOverlaySubType.TextAnnotation)).result.current;

    expect(visible).toBeTruthy();
  });

  it('should get annotation visibility as false', () => {
    useStore('default').setState({
      noHistoryStates: {
        ...useStore('default').getState().noHistoryStates,
        componentVisibilities: { ...componentVisibilities, [Component.DataOverlaySubType.TextAnnotation]: false },
      },
      isViewing: isViewingMock,
    });

    const visible = renderHook(() => useOverlayVisible(Component.DataOverlaySubType.TextAnnotation)).result.current;

    expect(visible).toBeFalsy();
  });
});
