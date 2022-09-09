import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Box, Button, FormField, Input } from '@awsui/components-react';

import { SceneRulesPanel } from '../SceneRulesPanel';

const removeSceneRuleMapById = jest.fn();
const updateSceneRuleMapById = jest.fn();
const getSceneRuleMapById = jest.fn().mockReturnValue({ statements: [{ expression: 'exp1', target: 'target1' }] });
const listSceneRuleMapIds = jest.fn().mockReturnValue(['rule1']);
const setNewRuleBasedMapId = jest.fn();

jest.spyOn(React, 'useState').mockReturnValue(['mapId', setNewRuleBasedMapId] as any);

jest.spyOn(React, 'useContext').mockReturnValue('sceneComponserId' as any);

jest.mock('../../../store/Store', () => {
  const originalModule = jest.requireActual('../../../store/Store');
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

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl');
  const intl = reactIntl.createIntl({
    locale: 'en',
  });

  return {
    ...reactIntl,
    useIntl: () => intl,
  };
});

configure({ adapter: new Adapter() });
describe('SceneRulesPanel returns expected elements.', () => {
  it('SceneRulesPanel returns expected elements.', async () => {
    const wrapper = shallow(<SceneRulesPanel />);

    const formField = wrapper.find(Box).find(FormField);
    expect(formField.props().label).toEqual('Rule Id');

    const input = formField.find(Input);
    expect(input.props().value).toEqual('mapId');

    input.props().onChange({ detail: { value: 'newValue' } });
    expect(setNewRuleBasedMapId).toBeCalledTimes(1);

    const button = wrapper.find(Box).find(Button);

    button.props().onClick();
    expect(updateSceneRuleMapById).toBeCalledTimes(1);
    expect(setNewRuleBasedMapId).toBeCalledTimes(3);
  });
});
