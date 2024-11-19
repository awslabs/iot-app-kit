import { render } from '@/tests/testing-library';

import { SceneRulesPanel } from './SceneRulesPanel';

vi.mock('../../logger/react-logger/log-provider', () => ({ default: (props) => <div {...props} /> }));
vi.mock('./CommonPanelComponents', () => ({
  ExpandableInfoSection: (props) => <div data-mocked='ExpandableInfoSection' {...props} />,
}));

const removeSceneRuleMapById = vi.fn();
const updateSceneRuleMapById = vi.fn();
const getSceneRuleMapById = vi.fn().mockReturnValue({ statements: [{ expression: 'exp1', target: 'target1' }] });
const listSceneRuleMapIds = vi.fn().mockReturnValue(['rule1']);
// const setNewRuleBasedMapId = vi.fn();

// vi.spyOn(React, 'useState').mockReturnValue(['mapId', setNewRuleBasedMapId] as any);

// vi.spyOn(React, 'useContext').mockReturnValue('sceneComponserId' as any);

vi.mock('../../store/Store', async () => {
  const originalModule = await vi.importActual('../../store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useSceneDocument: vi.fn(() => ({
      removeSceneRuleMapById: removeSceneRuleMapById,
      updateSceneRuleMapById: updateSceneRuleMapById,
      getSceneRuleMapById: getSceneRuleMapById,
      listSceneRuleMapIds: listSceneRuleMapIds,
    })),
  };
});

describe('SceneRulesPanel returns expected elements.', () => {
  it.skip('SceneRulesPanel returns expected elements.', async () => {
    const { container } = render(<SceneRulesPanel />);
    expect(container).toMatchSnapshot();
  });
});
