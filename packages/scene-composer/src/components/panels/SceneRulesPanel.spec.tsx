import React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IRuleBasedMapInternal, IRuleStatementInternal } from '../../store/internalInterfaces';
import { IRuleBasedMap } from '../../interfaces';

import { SceneRuleMapExpandableInfoSection, SceneRulesPanel } from './SceneRulesPanel';

jest.mock('../../logger/react-logger/log-provider', () => (props) => <div {...props} />);
jest.mock('./CommonPanelComponents', () => ({
  ExpandableInfoSection: (props) => <div data-mocked='ExpandableInfoSection' {...props} />,
}));

const removeSceneRuleMapById = jest.fn();
const updateSceneRuleMapById = jest.fn();
const getSceneRuleMapById = jest.fn().mockReturnValue({ statements: [{ expression: 'exp1', target: 'target1' }] });
const listSceneRuleMapIds = jest.fn().mockReturnValue(['rule1']);
const setNewRuleBasedMapId = jest.fn();

jest.spyOn(React, 'useState').mockReturnValue(['mapId', setNewRuleBasedMapId] as any);

jest.spyOn(React, 'useContext').mockReturnValue('sceneComponserId' as any);

jest.mock('../../store/Store', () => {
  const originalModule = jest.requireActual('../../store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useSceneDocument: jest.fn(() => ({
      removeSceneRuleMapById: removeSceneRuleMapById,
      updateSceneRuleMapById: updateSceneRuleMapById,
      getSceneRuleMapById: getSceneRuleMapById,
      listSceneRuleMapIds: listSceneRuleMapIds,
    })),
  };
});

describe('SceneRulesPanel returns expected elements.', () => {
  it('SceneRulesPanel returns expected elements.', async () => {
    const { container } = render(<SceneRulesPanel />);

    expect(container).toMatchSnapshot();
  });
});
