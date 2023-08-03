import wrapper from '@awsui/components-react/test-utils/dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { DefaultAnchorStatus, IotTwinMakerNumberNamespace, SceneResourceType } from '../../../../';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../../interfaces/feature';
import { convertToIotTwinMakerNamespace, getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import { colors } from '../../../../utils/styleUtils';
import { SceneRuleTargetEditor } from '../SceneRuleTargetEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));
jest.mock('../../../../common/GlobalSettings');
jest.mock('../../../../utils/sceneResourceUtils', () => {
  const originalModule = jest.requireActual('../../../../utils/sceneResourceUtils');
  return {
    ...originalModule,
    getSceneResourceInfo: jest.fn(),
  };
});
describe('SceneRuleTargetEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render color picker upon selecting the custom style', async () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    const mockFeatureConfig = { [COMPOSER_FEATURES.TagStyle]: true };
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    (getSceneResourceInfo as jest.Mock).mockReturnValue({
      type: SceneResourceType.Icon,
      value: DefaultAnchorStatus.Custom,
    });
    render(<SceneRuleTargetEditor target='Custom-123' onChange={onChange} />);

    const sceneRuleTargetIconEditor = screen.getByRole('button', { name: /Custom style/i });
    expect(sceneRuleTargetIconEditor).toBeTruthy();
    const colorPicker = screen.getByTestId('color-preview');
    colorPicker.click();
    const circlePicker = document.querySelector('.circle-picker');
    expect(circlePicker).toBeTruthy();
  });

  it('should change the selection from icon to color', () => {
    const { container } = render(<SceneRuleTargetEditor target={DefaultAnchorStatus.Info} onChange={onChange} />);
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();
    const err: any = null;

    select!.openDropdown();

    select!.selectOption(2);

    const expected = convertToIotTwinMakerNamespace(SceneResourceType.Color, colors.errorRed);
    expect(onChange).toBeCalledWith(expected);
  });

  it('should change the selection to number', () => {
    const { container } = render(<SceneRuleTargetEditor target={DefaultAnchorStatus.Info} onChange={onChange} />);
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select!.openDropdown();
    select!.selectOptionByValue('Number');

    const expected = convertToIotTwinMakerNamespace(SceneResourceType.Number, IotTwinMakerNumberNamespace);
    expect(onChange).toBeCalledWith(expected);
  });
});
