/* eslint-disable import/first */
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Select } from '@awsui/components-react';

import { SettingsPanel } from '../../../src/components/panels';
import { ExpandableInfoSection } from '../../../src/components/panels/CommonPanelComponents';
import { useStore } from '../../../src/store';

jest.spyOn(React, 'useContext').mockReturnValue('sceneComponserId' as any);

configure({ adapter: new Adapter() });
describe('SettingsPanel contains expected elements.', () => {
  it('SettingsPanel contains expected elements.', async () => {
    const setSceneProperty = jest.fn();
    useStore('sceneComponserId').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
    });

    const wrapper = shallow(<SettingsPanel />);

    const expandableInfoSection = wrapper.find(ExpandableInfoSection);
    expect(expandableInfoSection.props().title).toEqual('Scene Settings');

    const selectProps = expandableInfoSection.find(Select).props();

    expect(selectProps.selectedOption).toEqual({
      label: 'Neutral',
      value: 'neutral',
    });

    selectProps.onChange({ detail: { selectedOption: { value: 'value' } } });
    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty.mock.calls[0][1]).toEqual('value');
    setSceneProperty.mockReset();

    selectProps.onChange({ detail: { selectedOption: { value: 'n/a' } } });
    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty.mock.calls[0][1]).toEqual(undefined);
    setSceneProperty.mockReset();
  });
});
