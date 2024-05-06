import { renderHook } from '@testing-library/react';

import { accessStore } from '../store';
import { componentSettingsSelector } from '../utils/componentSettingsUtils';

import useTagSettings from './useTagSettings';

jest.mock('../utils/componentSettingsUtils');

describe('useTagSettings', () => {
  const isViewingMock = jest.fn();
  const settingsDocument = { scale: 2, autoScale: true };
  const settingsViewOption = { scale: 4, autoRescale: false };

  beforeEach(() => {
    (componentSettingsSelector as jest.Mock).mockReturnValue(settingsDocument);
    accessStore('default').setState({
      noHistoryStates: {
        ...accessStore('default').getState().noHistoryStates,
        tagSettings: settingsViewOption,
      },
      isViewing: isViewingMock,
    });
    isViewingMock.mockReturnValue(true);
  });

  it('should get tag settings from document in editing mode', () => {
    isViewingMock.mockReturnValue(false);
    const settings = renderHook(() => useTagSettings()).result.current;

    expect(settings).toEqual(settingsDocument);
  });

  it('should get tag settings from document in viewing mode when viewing settings is not defined', () => {
    accessStore('default').setState({
      noHistoryStates: {
        ...accessStore('default').getState().noHistoryStates,
        tagSettings: undefined,
      },
    });

    const settings = renderHook(() => useTagSettings()).result.current;
    expect(settings).toEqual(settingsDocument);
  });

  it('should get tag settings from view options in viewing mode', () => {
    const settings = renderHook(() => useTagSettings()).result.current;

    expect(settings).toEqual(settingsViewOption);
  });
});
