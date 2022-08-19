import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { mockComponent, mockProvider } from '../../../../../tests/components/panels/scene-components/MockComponents';
import { IMotionIndicatorComponentInternal, useStore } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';

import ColorEditor from './ColorEditor';

jest.mock('./DataBindingEditor', () => {
  const originalModule = jest.requireActual('./DataBindingEditor');
  return {
    ...originalModule,
    DataBindingEditor: (...props: any[]) => <div data-testid='DataBindingEditor'>{JSON.stringify(props)}</div>,
  };
});

let sliderOnChangeCb;
jest.mock('./Slider', () => {
  const originalModule = jest.requireActual('./Slider');
  return {
    ...originalModule,
    Slider: (...props: any[]) => {
      sliderOnChangeCb = props[0].onChange;
      return <div data-testid='Slider'>{JSON.stringify(props)}</div>;
    },
  };
});

let colorPickOnChangeCb;
jest.mock('react-color', () => {
  const originalModule = jest.requireActual('react-color');
  return {
    ...originalModule,
    SketchPicker: (...props: any[]) => {
      colorPickOnChangeCb = props[0].onChangeComplete;
      return <div data-testid='SketchPicker'>{JSON.stringify(props)}</div>;
    },
  };
});

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
