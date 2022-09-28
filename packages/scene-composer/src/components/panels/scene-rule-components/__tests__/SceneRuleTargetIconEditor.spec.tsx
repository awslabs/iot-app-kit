/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { SceneRuleTargetIconEditor } from '../SceneRuleTargetIconEditor';
import { DefaultAnchorStatus } from '../../../../';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('SceneRuleTargetIconEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should change target Icon on click', () => {
    const { container } = render(
      <SceneRuleTargetIconEditor targetValue={DefaultAnchorStatus.Info} onChange={onChange} />,
    );
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select!.openDropdown();
    select!.selectOption(2);

    expect(onChange).toBeCalledWith(DefaultAnchorStatus.Warning);
  });
});
