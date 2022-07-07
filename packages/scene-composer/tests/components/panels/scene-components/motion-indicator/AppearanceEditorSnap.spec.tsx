/* eslint-disable */
jest.doMock('../../../../../src/components/panels/scene-components/motion-indicator/ColorEditor', () => {
  const originalModule = jest.requireActual('../../../../../src/components/panels/scene-components/motion-indicator/ColorEditor');
  return {
    ...originalModule,
    ColorEditor: (...props: any[]) => (
      <div id='ColorEditor'>{JSON.stringify(props)}</div>
    )
  }
})

jest.doMock('../../../../../src/components/panels/scene-components/motion-indicator/PreviewArrow', () => {
  const originalModule = jest.requireActual('../../../../../src/components/panels/scene-components/motion-indicator/PreviewArrow');
  return {
    ...originalModule,
    PreviewArrow: (...props: any[]) => (
      <div id='PreviewArrow'>{JSON.stringify(props)}</div>
    )
  }
})

import { mockPolaris } from '../../../../__mocks__/MockPolaris';

mockPolaris();

import React from 'react';
import { render } from '@testing-library/react';

import {
  mockComponent,
} from '../MockComponents';

import { IMotionIndicatorComponentInternal } from '../../../../../src/store';
import { KnownComponentType } from '../../../../../src/interfaces';
import { Component } from '../../../../../src/SceneModels';
import { AppearanceEditor } from '../../../../../src/components/panels/scene-components/motion-indicator/AppearanceEditor';
/* eslint-enable */

const updateComponentInternalFn = jest.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
};

describe('AppearanceEditor', () => {
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
  const onUpdateCallback = jest.fn();

  it('should render correctly without data binding', () => {
    const { container } = render(
      <AppearanceEditor component={component} scale={[1, 2, 3]} onUpdateCallback={onUpdateCallback} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with foreground color binding', () => {
    const { container } = render(
      <AppearanceEditor
        component={{
          ...component,
          valueDataBindings: {
            [Component.MotionIndicatorDataBindingName.ForegroundColor]: { ruleBasedMapId: 'rule-1' },
          },
        }}
        scale={[1, 2, 3]}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with background color binding', () => {
    const { container } = render(
      <AppearanceEditor
        component={{
          ...component,
          valueDataBindings: {
            [Component.MotionIndicatorDataBindingName.BackgroundColor]: { ruleBasedMapId: 'rule-1' },
          },
        }}
        scale={[1, 2, 3]}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
