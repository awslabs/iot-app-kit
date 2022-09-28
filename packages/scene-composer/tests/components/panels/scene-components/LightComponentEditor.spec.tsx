/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';
import _ from 'lodash';

import {
  colorToHexString,
  LightComponentEditor,
} from '../../../../src/components/panels/scene-components/LightComponentEditor';
import { Color, LightType } from '../../../../src/models/SceneModels';
import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../../../src/common/constants';
import { ILightComponentInternal, useStore } from '../../../../src/store';

import { mockNode, mockComponent } from './MockComponents';

const mockParse = jest.fn((str: string, defaultValue: number) => {
  return 2;
});

jest.mock('../../../../src/utils/mathUtils', () => {
  const originalModule = jest.requireActual('../../../../src/utils/mathUtils');
  return {
    __esModule: true,
    ...originalModule,
    parseFloatOrDefault: (str: string, defaultValue: number) => mockParse(str, defaultValue),
  };
});

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const updateComponentInternalFn = jest.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getSceneNodeByRef: jest.fn(() => {
    return mockNode;
  }),
};

describe('LightComponentEditor', () => {
  const lightComponent: ILightComponentInternal = {
    ...mockComponent,
    lightType: LightType.Point,
    lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Point],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should select light types', () => {
    useStore('default').setState(baseState);

    const { container } = render(<LightComponentEditor node={mockNode} component={lightComponent} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select!.openDropdown();
    select!.selectOption(1);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        lightType: LightType.Ambient,
        lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Ambient],
      },
      true,
    );

    select!.openDropdown();
    select!.selectOption(2);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        lightType: LightType.Directional,
        lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Directional],
      },
      true,
    );

    select!.openDropdown();
    select!.selectOption(3);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        lightType: LightType.Hemisphere,
        lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Hemisphere],
      },
      true,
    );

    select!.openDropdown();
    select!.selectOption(4);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        lightType: LightType.Point,
        lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Point],
      },
      true,
    );
  });

  it('should select edit light settings', () => {
    useStore('default').setState(baseState);

    const { container } = render(<LightComponentEditor node={mockNode} component={lightComponent} />);
    const polarisWrapper = wrapper(container);

    const intensity = polarisWrapper.find('[data-testid="intensity-form-field"]')?.findInput();
    expect(intensity).not.toBeNull();
    intensity?.focus();
    intensity?.setInputValue('2.0');
    intensity?.blur();
    expect(mockParse).toBeCalledWith('2.0', 1);

    const checkBox = polarisWrapper.findCheckbox('[data-testid="cast-shadow-checkbox"]');
    checkBox?.findNativeInput().click();
    expect(checkBox).not.toBeNull();

    const distance = polarisWrapper.find('[data-testid="distance-form-field"]')?.findInput();
    expect(distance).not.toBeNull();
    distance?.focus();
    distance?.setInputValue('2.0');
    distance?.blur();
    expect(mockParse).toBeCalledWith('2.0', 1);

    const decay = polarisWrapper.find('[data-testid="decay-form-field"]')?.findInput();
    expect(decay).not.toBeNull();
    decay?.focus();
    decay?.setInputValue('2.0');
    decay?.blur();
    expect(mockParse).toBeCalledWith('2.0', 1);

    // switch to hemisphere to get it's unique field
    const select = polarisWrapper.findSelect();
    select!.openDropdown();
    select!.selectOption(3);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...mockNode.components[0],
        lightType: LightType.Hemisphere,
        lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Hemisphere],
      },
      true,
    );
  });

  it('should return correct values for color to string', () => {
    const colorStr: Color = '#ff0000';
    expect(colorToHexString(colorStr)).toEqual('#ff0000');
    const colorNumber: Color = 16711680;
    expect(colorToHexString(colorNumber)).toEqual('#ff0000');
  });
});
