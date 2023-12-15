import { render } from '@testing-library/react';
import React from 'react';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { IPlaneGeometryComponentInternal, useStore } from '../../../store';
import { KnownComponentType, COMPOSER_FEATURES } from '../../../interfaces';
import { mockNode, mockComponent } from '../../../../tests/components/panels/scene-components/MockComponents';

import { PlaneGeometryComponentEditor } from './PlaneGeometryComponentEditor';

jest.mock('../../../common/GlobalSettings');

jest.mock('../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo', () => {
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

  const updateComponentInternalFn = jest.fn();

  const baseState = {
    updateComponentInternal: updateComponentInternalFn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    useStore('default').setState(baseState);

    const { container } = render(
      <PlaneGeometryComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with color', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });
    useStore('default').setState(baseState);

    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithColor] }}
        component={componentWithColor}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with textured plane', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig });

    useStore('default').setState(baseState);

    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithTexturedPlane] }}
        component={componentWithTexturedPlane}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
