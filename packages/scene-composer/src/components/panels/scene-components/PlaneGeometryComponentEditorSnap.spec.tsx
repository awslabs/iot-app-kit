import { render } from '@/tests/testing-library';

import { mockComponent, mockNode } from '../../../../tests/components/panels/scene-components/MockComponents';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES, KnownComponentType } from '../../../interfaces';
import { type IPlaneGeometryComponentInternal, accessStore } from '../../../store';

import { PlaneGeometryComponentEditor } from './PlaneGeometryComponentEditor';

vi.mock('../../../common/GlobalSettings');

vi.mock('../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo', () => {
  return {
    ColorSelectorCombo: (...props: []) => <div id='ColorSelectorCombo'>{JSON.stringify(props)}</div>,
  };
});

describe('PlaneGeometryComponentEditor', () => {
  const mockFeatureConfig = { [COMPOSER_FEATURES.Textures]: true };

  const component: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
  };

  const componentWithColor: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    color: '#abcdef',
  };

  const componentWithTexturedPlane: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    textureUri: 'filepath',
  };

  const updateComponentInternalFn = vi.fn();

  const baseState = {
    updateComponentInternal: updateComponentInternalFn,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    accessStore('default').setState(baseState);

    const { container } = render(
      <PlaneGeometryComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with color', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    accessStore('default').setState(baseState);

    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithColor] }}
        component={componentWithColor}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with textured plane', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });

    accessStore('default').setState(baseState);

    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithTexturedPlane] }}
        component={componentWithTexturedPlane}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
