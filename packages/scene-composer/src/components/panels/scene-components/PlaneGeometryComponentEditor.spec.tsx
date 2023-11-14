import wrapper from '@awsui/components-react/test-utils/dom';
import { render } from '@testing-library/react';
import React from 'react';

import { IPlaneGeometryComponentInternal, useStore } from '../../../store';
import { KnownComponentType } from '../../../interfaces';
import { mockNode, mockComponent } from '../../../../tests/components/panels/scene-components/MockComponents';

import { PlaneGeometryComponentEditor } from './PlaneGeometryComponentEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('PlaneGeometryComponentEditor', () => {
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

  const updateComponentInternalFn = jest.fn();

  const baseState = {
    updateComponentInternal: updateComponentInternalFn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update width when width changes', async () => {
    useStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    const polarisWrapper = wrapper(container);
    const widthInput = polarisWrapper.findInput('[data-testid="plane-width-input"]');

    expect(widthInput).toBeDefined();

    widthInput!.focus();
    widthInput!.setInputValue('2');
    widthInput!.blur();

    expect(updateComponentInternalFn).toBeCalledTimes(1);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ...component, ref: component.ref, width: 2, height: component.height },
      true,
    );
  });

  it('should update height when height changes', async () => {
    useStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    const polarisWrapper = wrapper(container);
    const heightInput = polarisWrapper.findInput('[data-testid="plane-height-input"]');

    expect(heightInput).toBeDefined();

    heightInput!.focus();
    heightInput!.setInputValue('2');
    heightInput!.blur();

    expect(updateComponentInternalFn).toBeCalledTimes(1);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ...component, ref: component.ref, width: component.width, height: 2 },
      true,
    );
  });

  it('should update background when colors changes', async () => {
    useStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithColor] }}
        component={componentWithColor}
      />,
    );
    const polarisWrapper = wrapper(container);
    const colorInput = polarisWrapper.findInput('[data-testid="hexcode"]');

    expect(colorInput).toBeDefined();

    // click checkbox should update store
    colorInput!.focus();
    colorInput!.setInputValue('#FFFFFF');
    colorInput!.blur();
    expect(updateComponentInternalFn).toBeCalledTimes(1);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ...component, ref: component.ref, width: component.width, height: component.height, color: '#FFFFFF' },
      true,
    );
  });
});
