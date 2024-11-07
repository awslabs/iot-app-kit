import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render } from '@testing-library/react';

import { accessStore } from '../../../store';
import { KnownSceneProperty } from '../../../interfaces';

import { FogSettingsEditor } from './FogSettingsEditor';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

describe('FogSettingsEditor', () => {
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save fogsettings when enabled', async () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.FogSettings) {
        return undefined;
      } else if (property === KnownSceneProperty.FogCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    accessStore('default').setState(baseState);
    const { container } = render(<FogSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const toggle = polarisWrapper.findToggle();

    expect(toggle).toBeDefined();

    // click should update store
    act(() => {
      toggle?.findNativeInput().click();
    });
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.FogSettings, {
      color: '#cccccc',
      near: 1,
      far: 1000,
    });
  });

  it('should clear fogsettings when untoggled', async () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.FogSettings) {
        return {
          color: '#cccccc',
          near: 1,
          far: 1000,
        };
      } else if (property === KnownSceneProperty.FogCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    accessStore('default').setState(baseState);
    const { container } = render(<FogSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const toggle = polarisWrapper.findToggle();

    expect(toggle).toBeDefined();

    // click should update store
    act(() => {
      toggle?.findNativeInput().click();
    });
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.FogSettings, undefined);
  });

  it('should update fog when near changes', async () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.FogSettings) {
        return {
          color: '#cccccc',
          near: 1,
          far: 1000,
        };
      } else if (property === KnownSceneProperty.FogCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    accessStore('default').setState(baseState);
    const { container } = render(<FogSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const nearInput = polarisWrapper.findInput('[data-testid="fog-near-input"]');

    expect(nearInput).toBeDefined();

    nearInput!.focus();
    nearInput!.setInputValue('2');
    nearInput!.blur();

    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.FogSettings, {
      color: '#cccccc',
      near: 2,
      far: 1000,
    });
  });

  it('should update fog when far changes', async () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.FogSettings) {
        return {
          color: '#cccccc',
          near: 1,
          far: 1000,
        };
      } else if (property === KnownSceneProperty.FogCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    accessStore('default').setState(baseState);
    const { container } = render(<FogSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const farInput = polarisWrapper.findInput('[data-testid="fog-far-input"]');

    expect(farInput).toBeDefined();

    farInput!.focus();
    farInput!.setInputValue('2000');
    farInput!.blur();
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.FogSettings, {
      color: '#cccccc',
      near: 1,
      far: 2000,
    });
  });

  it('should update fog when colors changes', async () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.FogSettings) {
        return {
          color: '#cccccc',
          near: 1,
          far: 1000,
        };
      } else if (property === KnownSceneProperty.FogCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    accessStore('default').setState(baseState);
    const { container } = render(<FogSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const colorInput = polarisWrapper.findInput('[data-testid="hexcode"]');

    expect(colorInput).toBeDefined();

    colorInput!.focus();
    colorInput!.setInputValue('#FFFFFF');
    colorInput!.blur();
    expect(setScenePropertyMock).toBeCalledTimes(2);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.FogSettings, {
      color: '#FFFFFF',
      near: 1,
      far: 1000,
    });
  });
});
