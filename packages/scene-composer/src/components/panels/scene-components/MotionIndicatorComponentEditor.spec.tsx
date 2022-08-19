import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { IMotionIndicatorComponentInternal, useStore } from '../../../store';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { mockNode, mockComponent } from '../../../../tests/components/panels/scene-components/MockComponents';

import { MotionIndicatorComponentEditor } from './MotionIndicatorComponentEditor';

jest.mock('./motion-indicator/SpeedEditor', () => {
  const originalModule = jest.requireActual('./motion-indicator/SpeedEditor');
  return {
    ...originalModule,
    SpeedEditor: (...props: any[]) => <div id='SpeedEditor'>{JSON.stringify(props)}</div>,
  };
});

jest.mock('./motion-indicator/AppearanceEditor', () => (...props: any[]) => (
  <div id='AppearanceEditor'>{JSON.stringify(props)}</div>
));

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const updateComponentInternalFn = jest.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
};

describe('MotionIndicatorComponentEditor', () => {
  const component: IMotionIndicatorComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.MotionIndicator,
    shape: Component.MotionIndicatorShape.LinearCylinder,
    valueDataBindings: {},
    config: {
      numOfRepeatInY: 4,
      backgroundColorOpacity: 0.5,
    },
  };

  it('should change shape selection and trigger update component call', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <MotionIndicatorComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    const polarisWrapper = wrapper(container);

    const select = polarisWrapper.findSelect('[data-testid="motion-indicator-shape-select"]');
    select!.openDropdown();
    select!.selectOption(1);

    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...component,
        shape: Component.MotionIndicatorShape.LinearPlane,
      },
      true,
    );
  });
});
