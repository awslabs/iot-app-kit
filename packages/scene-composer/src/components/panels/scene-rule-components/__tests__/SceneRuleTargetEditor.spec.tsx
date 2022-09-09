import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { SceneRuleTargetEditor } from '../SceneRuleTargetEditor';
import { DefaultAnchorStatus, IotTwinMakerNumberNamespace, SceneResourceType } from '../../../../';
import { convertToIotTwinMakerNamespace } from '../../../../utils/sceneResourceUtils';
import { colors } from '../../../../utils/styleUtils';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('SceneRuleTargetEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
