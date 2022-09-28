import { updateComponentForColorTypeSelection } from '../../../../../src/components/panels/scene-components/motion-indicator/helpers';
import { Component } from '../../../../../src/models/SceneModels';

describe('updateComponentForColorTypeSelection', () => {
  const mockDataBinding = {
    valueDataBinding: { dataBindingContext: '123' },
    ruleBasedMapId: 'map-1',
  };

  it('should return correct component when background color is selected and foreground color has no binding', () => {
    const component = {
      valueDataBindings: {
        [Component.MotionIndicatorDataBindingName.ForegroundColor]: {},
      },
      config: {
        defaultForegroundColor: '123',
      },
    };

    const result = updateComponentForColorTypeSelection(
      Component.MotionIndicatorDataBindingName.BackgroundColor,
      component as any,
    );

    expect(result.config.defaultBackgroundColor).toEqual('123');
    expect(result.config.defaultForegroundColor).toBeUndefined();
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]).toEqual({});
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]).toBeUndefined();
  });

  it('should return correct component when background color is selected and foreground color has binding', () => {
    const component = {
      valueDataBindings: {
        [Component.MotionIndicatorDataBindingName.ForegroundColor]: mockDataBinding,
      },
      config: {
        defaultForegroundColor: '123',
      },
    };

    const result = updateComponentForColorTypeSelection(
      Component.MotionIndicatorDataBindingName.BackgroundColor,
      component as any,
    );

    expect(result.config.defaultBackgroundColor).toEqual('123');
    expect(result.config.defaultForegroundColor).toBeUndefined();
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]).toEqual(mockDataBinding);
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]).toBeUndefined();
  });

  it('should return correct component when foreground color is selected and background color has no binding', () => {
    const component = {
      valueDataBindings: {
        [Component.MotionIndicatorDataBindingName.BackgroundColor]: {},
      },
      config: {
        defaultBackgroundColor: '123',
      },
    };

    const result = updateComponentForColorTypeSelection(
      Component.MotionIndicatorDataBindingName.ForegroundColor,
      component as any,
    );

    expect(result.config.defaultForegroundColor).toEqual('123');
    expect(result.config.defaultBackgroundColor).toBeUndefined();
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]).toEqual({});
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]).toBeUndefined();
  });

  it('should return correct component when foreground color is selected and background color has binding', () => {
    const component = {
      valueDataBindings: {
        [Component.MotionIndicatorDataBindingName.BackgroundColor]: mockDataBinding,
      },
      config: {
        defaultBackgroundColor: '123',
      },
    };

    const result = updateComponentForColorTypeSelection(
      Component.MotionIndicatorDataBindingName.ForegroundColor,
      component as any,
    );

    expect(result.config.defaultForegroundColor).toEqual('123');
    expect(result.config.defaultBackgroundColor).toBeUndefined();
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]).toEqual(mockDataBinding);
    expect(result.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]).toBeUndefined();
  });
});
