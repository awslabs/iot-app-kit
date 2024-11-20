import useFeature from '../../../hooks/useFeature';
import SceneHierarchyPanel from './SceneHierarchyPanel';
import { render } from '@/tests/testing-library';

vi.mock('../../../hooks/useFeature');

describe('SceneHierarchyPanel', () => {
  ['T1', 'C'].forEach((treatment) => {
    it(`should render hierarchy correctly when enabled is "${treatment}"`, () => {
      (useFeature as unknown as vi.Mock).mockImplementation(() => [{ variation: treatment }]);

      const { container } = render(<SceneHierarchyPanel />);
      expect(container).toMatchSnapshot();
    });
  });
});
