import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { mockReactIntl } from '../../../__mocks__/MockReactIntl';
import { SceneRuleTargetEditor } from '../../../../src/components/panels/scene-rule-components/SceneRuleTargetEditor';
import {
  COMPOSER_FEATURES,
  DefaultAnchorStatus,
  IotTwinMakerNumberNamespace,
  SceneResourceType,
  setFeatureConfig,
} from '../../../../src';
import { convertToIotTwinMakerNamespace } from '../../../../src/utils/sceneResourceUtils';
import { colors } from '../../../../src/utils/styleUtils';
mockReactIntl();

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('SceneRuleTargetEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    setFeatureConfig({});
  });

  it('should change the selection from icon to color', () => {
    const { container } = render(<SceneRuleTargetEditor target={DefaultAnchorStatus.Info} onChange={onChange} />);
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select!.openDropdown();

    // no option "Number" when Motion Indicator is disabled.
    try {
      select?.selectOptionByValue('Number');
    } catch (e: any) {
      expect(e.message).toContain('no option with the value "Number"');
    }

    select!.selectOption(2);

    const expected = convertToIotTwinMakerNamespace(SceneResourceType.Color, colors.errorRed);
    expect(onChange).toBeCalledWith(expected);
  });

  it('should change the selection to number', () => {
    setFeatureConfig({ [COMPOSER_FEATURES.MOTION_INDICATOR]: true });
    const { container } = render(<SceneRuleTargetEditor target={DefaultAnchorStatus.Info} onChange={onChange} />);
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select!.openDropdown();
    select!.selectOptionByValue('Number');

    const expected = convertToIotTwinMakerNamespace(SceneResourceType.Number, IotTwinMakerNumberNamespace);
    expect(onChange).toBeCalledWith(expected);
  });
});
