/* eslint-disable import/first */
import wrapper from '@cloudscape-design/components/test-utils/dom';
import { render } from '@/tests/testing-library';

import { DefaultAnchorStatus } from '../../../../interfaces/components';
import { SceneRuleTargetIconEditor } from '../SceneRuleTargetIconEditor';

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

vi.mock('../../../../common/GlobalSettings');

describe('SceneRuleTargetIconEditor', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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
