import { render } from '@/tests/testing-library';
import { useIntl } from 'react-intl';

import { DefaultAnchorStatus, SceneResourceType } from '../../../../';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import { SceneRuleTargetEditor } from '../SceneRuleTargetEditor';

vi.mock('../SceneRuleTargetColorEditor', () => ({
  SceneRuleTargetColorEditor: () => 'SceneRuleTargetColorEditor',
}));
vi.mock('../SceneRuleTargetIconEditor', () => ({
  SceneRuleTargetIconEditor: () => 'SceneRuleTargetIconEditor',
}));
vi.mock('../SceneRuleTargetOpacityEditor', () => ({ default: () => 'SceneRuleTargetOpacityEditor' }));

vi.mock('../../../../utils/sceneResourceUtils', async () => ({
  ...(await vi.importActual('../../../../utils/sceneResourceUtils')),
  getSceneResourceInfo: vi.fn(),
}));

vi.mock('react-intl', async () => ({
  ...(await vi.importActual('react-intl')),
  useIntl: vi.fn(),
}));

vi.mock('../../../../hooks/useFeature', () => ({ default: vi.fn() }));

describe('SceneRuleTargetEditor', () => {
  [{ type: SceneResourceType.Icon }, { type: SceneResourceType.Color }, { type: SceneResourceType.Opacity }].forEach(
    ({ type }) => {
      it(`should render a drop down with appropriate resource type: ${type}`, () => {
        (useIntl as vi.Mock).mockReturnValue({
          formatMessage: vi.fn(() => 'test message'),
        });
        (getSceneResourceInfo as vi.Mock).mockReturnValue({
          type,
        });

        const { container } = render(<SceneRuleTargetEditor target={DefaultAnchorStatus.Info} onChange={vi.fn()} />);

        expect(container).toMatchSnapshot();
      });
    },
  );
});
