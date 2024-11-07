/* eslint-disable import/first */
import { render } from '@testing-library/react';
import wrapper from '@cloudscape-design/components/test-utils/dom';

import { SceneRuleTargetIconEditor } from '../SceneRuleTargetIconEditor';
import { DefaultAnchorStatus } from '../../../../interfaces/components';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

jest.mock('../../../../common/GlobalSettings');

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

  it('should render SceneRuleTargetIconEditor with custom icon', () => {
    const { container } = render(
      <SceneRuleTargetIconEditor targetValue={DefaultAnchorStatus.Info} onChange={onChange} />,
    );
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select?.openDropdown();
    select?.selectOption(5);
    expect(onChange).toBeCalledWith(DefaultAnchorStatus.Custom);
  });
});
