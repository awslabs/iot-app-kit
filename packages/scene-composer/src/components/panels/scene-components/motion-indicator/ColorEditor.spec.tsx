import { fireEvent, render } from '@/tests/testing-library';

import { mockComponent, mockProvider } from '../../../../../tests/components/panels/scene-components/MockComponents';
import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { type IMotionIndicatorComponentInternal, accessStore } from '../../../../store';

import ColorEditor from './ColorEditor';

vi.mock('./DataBindingEditor', async () => {
  const originalModule = await vi.importActual('./DataBindingEditor');
  return {
    ...originalModule,
    DataBindingEditor: (...props: any[]) => <div data-testid='DataBindingEditor'>{JSON.stringify(props)}</div>,
  };
});

let _sliderOnChangeCb;
vi.mock('../../Slider', async () => {
  const originalModule = await vi.importActual('../../Slider');
  return {
    ...originalModule,
    Slider: (...props: any[]) => {
      _sliderOnChangeCb = props[0].onChange;
      return <div data-testid='Slider'>{JSON.stringify(props)}</div>;
    },
  };
});

vi.mock('../../ColorPicker/ColorPicker', () => ({
  ColorPicker: (props) => <div data-mocked='ColorPicker'>{JSON.stringify(props)}</div>,
}));

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
  const onUpdateCallback = vi.fn();

  it('should render correctly for background color with data binding', () => {
    accessStore('default').setState(baseState);

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
    accessStore('default').setState(baseState);

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
    accessStore('default').setState(baseState);

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
    accessStore('default').setState(baseState);

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
    accessStore('default').setState(baseState);

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
    accessStore('default').setState(baseState);

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
