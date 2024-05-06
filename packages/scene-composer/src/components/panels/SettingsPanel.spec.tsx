import React from 'react';
import { render } from '@testing-library/react';

import { accessStore } from '../../store';
import { setFeatureConfig } from '../../common/GlobalSettings';
import { mockProvider } from '../../../tests/components/panels/scene-components/MockComponents';
import useDynamicScene from '../../hooks/useDynamicScene';

import { SettingsPanel } from '.';

jest.mock('./scene-settings', () => {
  const originalModule = jest.requireActual('./scene-settings');
  return {
    ...originalModule,
    SceneDataBindingTemplateEditor: 'SceneDataBindingTemplateEditor',
    SceneTagSettingsEditor: 'SceneTagSettingsEditor',
  };
});

jest.mock('./scene-settings/ConvertSceneSettings', () => {
  const originalModule = jest.requireActual('./scene-settings/ConvertSceneSettings');
  return {
    ...originalModule,
    ConvertSceneSettings: (props) => <div data-mocked='ConvertSceneSettings' {...props} />,
  };
});

jest.mock('./CommonPanelComponents', () => ({
  ...jest.requireActual('./CommonPanelComponents'),
  ExpandableInfoSection: (props) => <div data-mocked='ExpandableInfoSection' {...props} />,
}));

jest.mock('../../hooks/useDynamicScene', () => jest.fn());

describe('SettingsPanel contains expected elements.', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    setFeatureConfig({});
    accessStore('default').setState({
      setSceneProperty: jest.fn(),
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn(),
    });
    (useDynamicScene as jest.Mock).mockReturnValue(false);
  });

  it('should contains default elements in editing mode.', async () => {
    accessStore('default').setState({
      isEditing: jest.fn().mockReturnValue(true),
    });

    const { container, queryByTitle } = render(<SettingsPanel valueDataBindingProvider={mockProvider} />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryByTitle('Scene Settings')).toBeTruthy();
    expect(queryByTitle('Tag Settings')).toBeTruthy();
    expect(queryByTitle('Data Binding Template')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should contains default elements in viewing mode.', async () => {
    accessStore('default').setState({
      isEditing: jest.fn().mockReturnValue(false),
    });

    const { container, queryByTitle } = render(<SettingsPanel valueDataBindingProvider={mockProvider} />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryByTitle('Scene Settings')).toBeFalsy();
    expect(queryByTitle('Tag Settings')).toBeTruthy();
    expect(queryByTitle('Data Binding Template')).toBeFalsy();
    expect(container).toMatchSnapshot();
  });

  it('should contains settings element for overlay in editing.', async () => {
    accessStore('default').setState({
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
    accessStore('default').setState({
      isEditing: jest.fn().mockReturnValue(false),
    });

    const { container, queryByTitle, queryAllByText } = render(<SettingsPanel />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryAllByText('Overlay').length).toEqual(1);
    expect(queryAllByText('Annotation').length).toEqual(1);
    expect(queryByTitle('Tag Settings')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should contains settings element for converting scene in editing.', async () => {
    (useDynamicScene as jest.Mock).mockReturnValue(true);
    accessStore('default').setState({
      isEditing: jest.fn().mockReturnValue(true),
    });

    const { container, queryByTitle } = render(<SettingsPanel />);

    expect(queryByTitle('Convert scene')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should not contain settings element for converting scene in viewing.', async () => {
    (useDynamicScene as jest.Mock).mockReturnValue(true);
    accessStore('default').setState({
      isEditing: jest.fn().mockReturnValue(false),
    });

    const { queryByTitle } = render(<SettingsPanel />);

    expect(queryByTitle('Convert scene')).toBeFalsy();
  });
});
