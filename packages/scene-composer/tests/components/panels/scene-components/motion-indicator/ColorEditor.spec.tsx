import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { mockComponent, mockProvider } from '../MockComponents';
import { IMotionIndicatorComponentInternal, useStore } from '../../../../../src/store';
import { KnownComponentType } from '../../../../../src/interfaces';
import { Component } from '../../../../../src/SceneModels';
import { ColorEditor } from '../../../../../src/components/panels/scene-components/motion-indicator/ColorEditor';

jest.mock('../../../../../src/components/panels/scene-components/motion-indicator/DataBindingEditor', () => {
  const originalModule = jest.requireActual(
    '../../../../../src/components/panels/scene-components/motion-indicator/DataBindingEditor',
  );
  return {
    ...originalModule,
    DataBindingEditor: (...props: any[]) => <div data-testid='DataBindingEditor'>{JSON.stringify(props)}</div>,
  };
});

let sliderOnChangeCb;
jest.mock('../../../../../src/components/panels/scene-components/motion-indicator/Slider', () => {
  const originalModule = jest.requireActual(
    '../../../../../src/components/panels/scene-components/motion-indicator/Slider',
  );
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

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update correctly when color selection change with data binding', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={component}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    const polarisWrapper = wrapper(rendered.container);

    expect(rendered.queryByTestId('DataBindingEditor')).toBeTruthy();

    const select = polarisWrapper.findSelect('[data-testid="motion-indicator-color-select"]');

    select!.openDropdown();
    select!.selectOption(1);

    expect(rendered.queryByTestId('DataBindingEditor')).toBeFalsy();
    expect(rendered.queryByTestId('SketchPicker')).toBeFalsy();
    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        valueDataBindings: {
          ...component.valueDataBindings,
          [Component.MotionIndicatorDataBindingName.BackgroundColor]: {},
        },
      },
      true,
    );

    // call update to clear default value when use binding is selected
    select!.openDropdown();
    select!.selectOption(2);
    expect(onUpdateCallback).toBeCalledTimes(2);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        config: {
          ...component.config,
          defaultBackgroundColor: undefined,
        },
      },
      true,
    );
  });

  it('should update correctly when color selection change without data binding', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    const polarisWrapper = wrapper(rendered.container);
    fireEvent.click(rendered.getByTestId('background-color-swatch'));

    expect(rendered.queryByTestId('SketchPicker')).toBeTruthy();

    const select = polarisWrapper.findSelect('[data-testid="motion-indicator-color-select"]');

    select!.openDropdown();
    select!.selectOption(1);

    expect(rendered.queryByTestId('SketchPicker')).toBeFalsy();
    expect(rendered.queryByTestId('DataBindingEditor')).toBeFalsy();
    expect(onUpdateCallback).toBeCalledTimes(1);
  });

  it('should slider update opacity correctly', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={component}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );

    fireEvent.click(rendered.getByTestId('opacity-button'));
    sliderOnChangeCb({ target: { value: 30 } });

    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        config: { ...component.config, backgroundColorOpacity: 0.3 },
      },
      true,
    );
  });

  it('should color picker update default background color correctly', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.BackgroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );

    fireEvent.click(rendered.getByTestId('background-color-swatch'));
    colorPickOnChangeCb({ hex: 'color-a' });

    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        valueDataBindings: {},
        config: { ...component.config, defaultBackgroundColor: 'color-a', defaultForegroundColor: undefined },
      },
      true,
    );
  });

  it('should color picker update default foreground color correctly', () => {
    useStore('default').setState(baseState);

    const rendered = render(
      <ColorEditor
        component={{ ...component, valueDataBindings: {} }}
        selectedColorType={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
      />,
    );

    fireEvent.click(rendered.getByTestId('foreground-color-swatch'));
    colorPickOnChangeCb({ hex: 'color-a' });

    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        valueDataBindings: {},
        config: { ...component.config, defaultBackgroundColor: undefined, defaultForegroundColor: 'color-a' },
      },
      true,
    );
  });
});
