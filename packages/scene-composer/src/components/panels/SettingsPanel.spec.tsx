import { render } from '@testing-library/react';

import { mockProvider } from '../../../tests/components/panels/scene-components/MockComponents';
import { setFeatureConfig } from '../../common/GlobalSettings';
import useDynamicScene from '../../hooks/useDynamicScene';
import { accessStore } from '../../store';

import { SettingsPanel } from '.';

vi.mock('./scene-settings', async () => {
  const originalModule = await vi.importActual('./scene-settings');
  return {
    ...originalModule,
    SceneDataBindingTemplateEditor: 'SceneDataBindingTemplateEditor',
    SceneTagSettingsEditor: 'SceneTagSettingsEditor',
  };
});

vi.mock('./scene-settings/ConvertSceneSettings', async () => {
  const originalModule = await vi.importActual('./scene-settings/ConvertSceneSettings');
  return {
    ...originalModule,
    ConvertSceneSettings: (props) => <div data-mocked='ConvertSceneSettings' {...props} />,
  };
});

vi.mock('./CommonPanelComponents', async () => ({
  ...(await vi.importActual('./CommonPanelComponents')),
  ExpandableInfoSection: (props) => <div data-mocked='ExpandableInfoSection' {...props} />,
}));

vi.mock('../../hooks/useDynamicScene', () => vi.fn());

describe('SettingsPanel contains expected elements.', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    setFeatureConfig({});
    accessStore('default').setState({
      setSceneProperty: vi.fn(),
      getSceneProperty: vi.fn().mockReturnValue('neutral'),
      isEditing: vi.fn(),
    });
    (useDynamicScene as vi.Mock).mockReturnValue(false);
  });

  it('should contains default elements in editing mode.', async () => {
    accessStore('default').setState({
      isEditing: vi.fn().mockReturnValue(true),
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
      isEditing: vi.fn().mockReturnValue(false),
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
      isEditing: vi.fn().mockReturnValue(true),
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
      isEditing: vi.fn().mockReturnValue(false),
    });

    const { container, queryByTitle, queryAllByText } = render(<SettingsPanel />);

    expect(queryByTitle('Current View Settings')).toBeTruthy();
    expect(queryAllByText('Overlay').length).toEqual(1);
    expect(queryAllByText('Annotation').length).toEqual(1);
    expect(queryByTitle('Tag Settings')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should contains settings element for converting scene in editing.', async () => {
    (useDynamicScene as vi.Mock).mockReturnValue(true);
    accessStore('default').setState({
      isEditing: vi.fn().mockReturnValue(true),
    });

    const { container, queryByTitle } = render(<SettingsPanel />);

    expect(queryByTitle('Convert scene')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should not contain settings element for converting scene in viewing.', async () => {
    (useDynamicScene as vi.Mock).mockReturnValue(true);
    accessStore('default').setState({
      isEditing: vi.fn().mockReturnValue(false),
    });

    const { queryByTitle } = render(<SettingsPanel />);

    expect(queryByTitle('Convert scene')).toBeFalsy();
  });
});
