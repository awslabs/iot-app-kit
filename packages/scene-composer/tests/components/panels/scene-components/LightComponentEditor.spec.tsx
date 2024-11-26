/* eslint-disable import/first */
import wrapper from '@cloudscape-design/components/test-utils/dom';
import { render } from '@testing-library/react';
import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../../../src/common/constants';
import { LightComponentEditor } from '../../../../src/components/panels/scene-components/LightComponentEditor';
import { LightType } from '../../../../src/models/SceneModels';
import { type ILightComponentInternal, accessStore } from '../../../../src/store';
import { mockComponent, mockNode } from './MockComponents';

const mockParse = vi.fn((_str: string, _defaultValue: number) => {
  return 2;
});

vi.mock('../../../../src/utils/mathUtils', async () => {
  const originalModule = await vi.importActual('../../../../src/utils/mathUtils');
  return {
    __esModule: true,
    ...originalModule,
    parseFloatOrDefault: (str: string, defaultValue: number) => mockParse(str, defaultValue),
  };
});

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
vi.mock('@cloudscape-design/components', () => ({
  ...vi.importActual('@cloudscape-design/components'),
}));

const updateComponentInternalFn = vi.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getSceneNodeByRef: vi.fn(() => {
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
    vi.clearAllMocks();
  });

  it('should select light types', () => {
    accessStore('default').setState(baseState);

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
    accessStore('default').setState(baseState);

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
});
