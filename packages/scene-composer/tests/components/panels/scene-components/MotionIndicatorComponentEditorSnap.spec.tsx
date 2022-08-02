import React from 'react';
import { render } from '@testing-library/react';

import { MotionIndicatorComponentEditor } from '../../../../src/components/panels/scene-components/MotionIndicatorComponentEditor';
import { IMotionIndicatorComponentInternal, useStore } from '../../../../src/store';
import { KnownComponentType } from '../../../../src/interfaces';
import { Component } from '../../../../src/models/SceneModels';

import { mockNode, mockComponent } from './MockComponents';

jest.mock('../../../../src/components/panels/scene-components/motion-indicator/SpeedEditor', () => {
  const originalModule = jest.requireActual(
    '../../../../src/components/panels/scene-components/motion-indicator/SpeedEditor',
  );
  return {
    ...originalModule,
    SpeedEditor: (...props: any[]) => <div id='SpeedEditor'>{JSON.stringify(props)}</div>,
  };
});

jest.mock('../../../../src/components/panels/scene-components/motion-indicator/AppearanceEditor', () => {
  const originalModule = jest.requireActual(
    '../../../../src/components/panels/scene-components/motion-indicator/AppearanceEditor',
  );
  return {
    ...originalModule,
    AppearanceEditor: (...props: any[]) => <div id='AppearanceEditor'>{JSON.stringify(props)}</div>,
  };
});

const updateComponentInternalFn = jest.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
};

describe('MotionIndicatorComponentEditor', () => {
  const component: IMotionIndicatorComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.MotionIndicator,
    shape: Component.MotionIndicatorShape.LinearPlane,
    valueDataBindings: {},
    config: {
      numOfRepeatInY: 4,
      backgroundColorOpacity: 0.5,
    },
  };

  it('should render correctly', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <MotionIndicatorComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    expect(container).toMatchSnapshot();
  });
});
