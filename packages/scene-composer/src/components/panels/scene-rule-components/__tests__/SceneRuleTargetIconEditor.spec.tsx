/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { SceneRuleTargetIconEditor } from '../SceneRuleTargetIconEditor';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../../interfaces/feature';
import { DefaultAnchorStatus } from '../../../../interfaces/components';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

jest.mock('../../../../common/GlobalSettings');

describe('SceneRuleTargetIconEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should change target Icon on click', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    const mockFeatureConfig = { [COMPOSER_FEATURES.TagStyle]: true };
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    const { container } = render(
      <SceneRuleTargetIconEditor targetValue={DefaultAnchorStatus.Info} onChange={onChange} />,
    );
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select!.openDropdown();
    select!.selectOption(2);

    expect(onChange).toBeCalledWith(DefaultAnchorStatus.Warning);
  });

  it('should render SceneRuleTargetIconEditor with custom icon', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    const mockFeatureConfig = { [COMPOSER_FEATURES.TagStyle]: true };
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    const { container } = render(
      <SceneRuleTargetIconEditor targetValue={DefaultAnchorStatus.Info} onChange={onChange} />,
    );
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select?.openDropdown();
    select?.selectOption(5);
    expect(onChange).toBeCalledWith(DefaultAnchorStatus.Custom);
  });

  it('should render SceneRuleTargetIconEditor with no custom icon', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    const mockFeatureConfig = { [COMPOSER_FEATURES.TagStyle]: false };
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    const { container } = render(
      <SceneRuleTargetIconEditor targetValue={DefaultAnchorStatus.Info} onChange={onChange} />,
    );
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select?.openDropdown();
    expect(select?.findDropdown().findOptions().length).toEqual(4);
  });
});
