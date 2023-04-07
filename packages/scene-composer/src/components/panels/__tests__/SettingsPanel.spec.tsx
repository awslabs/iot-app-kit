import React from 'react';
import { render } from '@testing-library/react';

import { SettingsPanel } from '..';
import { useStore } from '../../../store';
import { setFeatureConfig } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../interfaces';
import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';

jest.mock('../scene-settings', () => {
  const originalModule = jest.requireActual('../scene-settings');
  return {
    ...originalModule,
    SceneDataBindingTemplateEditor: 'SceneDataBindingTemplateEditor',
    SceneTagSettingsEditor: 'SceneTagSettingsEditor',
  };
});

jest.mock('../CommonPanelComponents', () => ({
  ...jest.requireActual('../CommonPanelComponents'),
  ExpandableInfoSection: (props) => <div data-mocked='ExpandableInfoSection' {...props} />,
}));

describe('SettingsPanel contains expected elements.', () => {
  it('should contains default elements in editing mode.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.TagResize]: false });
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn().mockReturnValue(true),
    });

    const { container, queryByTitle } = render(<SettingsPanel valueDataBindingProvider={mockProvider} />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryByTitle('Scene Settings')).toBeTruthy();
    expect(queryByTitle('Tag Settings')).toBeFalsy();
    expect(queryByTitle('Data Binding Template')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should contains default elements in viewing mode.', async () => {
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn().mockReturnValue(false),
    });

    const { container, queryByTitle } = render(<SettingsPanel valueDataBindingProvider={mockProvider} />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryByTitle('Scene Settings')).toBeFalsy();
    expect(queryByTitle('Tag Settings')).toBeFalsy();
    expect(queryByTitle('Data Binding Template')).toBeFalsy();
    expect(container).toMatchSnapshot();
  });

  it('should contains tag settings element.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.TagResize]: true });
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
    });

    const { container, queryByTitle } = render(<SettingsPanel />);

    expect(queryByTitle('Tag Settings')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should contains settings element for overlay in editing.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true });
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn().mockReturnValue(true),
    });

    const { container, queryByTitle, queryAllByText } = render(<SettingsPanel />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryAllByText('Overlay').length).toEqual(2);
    expect(queryAllByText('Annotation').length).toEqual(1);
    expect(queryByTitle('Tag Settings')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should contains settings element for overlay in viewing.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true });
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn().mockReturnValue(false),
    });

    const { container, queryByTitle, queryAllByText } = render(<SettingsPanel />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryAllByText('Overlay').length).toEqual(1);
    expect(queryAllByText('Annotation').length).toEqual(1);
    expect(queryByTitle('Tag Settings')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
