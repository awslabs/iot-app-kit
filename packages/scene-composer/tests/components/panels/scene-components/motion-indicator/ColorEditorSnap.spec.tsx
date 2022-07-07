/* eslint-disable */
jest.doMock('../../../../../src/components/panels/scene-components/motion-indicator/DataBindingEditor', () => {
  const originalModule = jest.requireActual('../../../../../src/components/panels/scene-components/motion-indicator/DataBindingEditor');
  return {
    ...originalModule,
    DataBindingEditor: (...props: any[]) => (
      <div id='DataBindingEditor'>{JSON.stringify(props)}</div>
    )
  }
})

jest.doMock('../../../../../src/components/panels/scene-components/motion-indicator/Slider', () => {
  const originalModule = jest.requireActual('../../../../../src/components/panels/scene-components/motion-indicator/Slider');
  return {
    ...originalModule,
    Slider: (...props: any[]) => (
      <div id='Slider'>{JSON.stringify(props)}</div>
    )
  }
})

jest.doMock('react-color', () => {
  const originalModule = jest.requireActual('react-color');
  return {
    ...originalModule,
    SketchPicker: (...props: any[]) => (
      <div id='SketchPicker'>{JSON.stringify(props)}</div>
    )
  }
})

import { mockPolaris } from '../../../../__mocks__/MockPolaris';

mockPolaris();

import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import {
  mockComponent, mockProvider,
} from '../MockComponents';

import { IMotionIndicatorComponentInternal, useStore } from '../../../../../src/store';
import { KnownComponentType } from '../../../../../src/interfaces';
import { Component } from '../../../../../src/SceneModels';
import { ColorEditor } from '../../../../../src/components/panels/scene-components/motion-indicator/ColorEditor';

/* eslint-enable */

const baseState = {
  getEditorConfig: () => mockProvider,
} as any;

describe('ColorEditor', () => {
  const component: IMotionIndicatorComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.MotionIndicator,
    shape: Component.MotionIndicatorShape.LinearPlane,
    valueDataBindings: {
      [Component.MotionIndicatorDataBindingName.BackgroundColor]: { ruleBasedMapId: 'rule-1' },
      [Component.MotionIndicatorDataBindingName.ForegroundColor]: { ruleBasedMapId: 'rule-2' },
    },
    config: {
      numOfRepeatInY: 4,
      backgroundColorOpacity: 0.5,
      defaultBackgroundColor: 'red',
      defaultForegroundColor: 'blue',
    },
  };
  const onUpdateCallback = jest.fn();

  it('should render correctly for background color with data binding', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <ColorEditor
        component={component}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly for background color without data binding', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(rendered.container).toMatchSnapshot();

    // hide color picker when component.ref changed
    fireEvent.click(rendered.getByTestId('background-color-swatch'));
    fireEvent.click(rendered.getByTestId('opacity-button'));
    rendered.rerender(
      <ColorEditor
        component={{ ...component, valueDataBindings: {}, ref: 'new-ref' }}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(rendered.container).toMatchSnapshot();
  });

  it('should render correctly for background color with slider and color picker shown', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );

    fireEvent.click(rendered.getByTestId('background-color-swatch'));
    fireEvent.click(rendered.getByTestId('opacity-button'));

    expect(rendered.container).toMatchSnapshot();

    // hide sider when selected color type changed
    rendered.rerender(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(rendered.container).toMatchSnapshot();
  });

  it('should render correctly for foreground color with data binding', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <ColorEditor
        component={component}
        selectedColorType={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly for foreground color without data binding', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly for foreground color with  color picker shown', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );

    fireEvent.click(rendered.getByTestId('foreground-color-swatch'));

    expect(rendered.queryByTestId('opacity-button')).toBeFalsy();
    expect(rendered.container).toMatchSnapshot();

    // hide color picker when component.ref changed
    rendered.rerender(
      <ColorEditor
        component={{ ...component, valueDataBindings: {}, ref: 'new-ref' }}
        selectedColorType={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(rendered.container).toMatchSnapshot();
  });
});
