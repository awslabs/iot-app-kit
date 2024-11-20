import { fireEvent, render } from '@testing-library/react';
import wrapper from '@cloudscape-design/components/test-utils/dom';

import { mockComponent, mockProvider } from '../MockComponents';
import { type IMotionIndicatorComponentInternal, accessStore } from '../../../../../src/store';
import { KnownComponentType } from '../../../../../src/interfaces';
import { Component } from '../../../../../src/models/SceneModels';
import { SpeedEditor } from '../../../../../src/components/panels/scene-components/motion-indicator/SpeedEditor';

vi.mock('../../../../../src/components/panels/scene-components/motion-indicator/DataBindingEditor', async () => {
  const originalModule = await vi.importActual(
    '../../../../../src/components/panels/scene-components/motion-indicator/DataBindingEditor',
  );
  return {
    ...originalModule,
    DataBindingEditor: (...props: any[]) => <div data-testid='DataBindingEditor'>{JSON.stringify(props)}</div>,
  };
});

let sliderOnChangeCb;
vi.mock('../../../../../src/components/panels/Slider', async () => {
  const originalModule = await vi.importActual('../../../../../src/components/panels/Slider');
  return {
    ...originalModule,
    Slider: (...props: any[]) => {
      sliderOnChangeCb = props[0].onChange;
      return <div data-testid='Slider'>{JSON.stringify(props)}</div>;
    },
  };
});

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
vi.mock('@cloudscape-design/components', () => ({
  ...vi.importActual('@cloudscape-design/components'),
}));

const baseState = {
  getEditorConfig: () => mockProvider,
} as any;

describe('SpeedEditor', () => {
  const component: IMotionIndicatorComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.MotionIndicator,
    shape: Component.MotionIndicatorShape.LinearPlane,
    valueDataBindings: {
      [Component.MotionIndicatorDataBindingName.Speed]: { ruleBasedMapId: 'rule-1' },
    },
    config: {
      numOfRepeatInY: 4,
      backgroundColorOpacity: 0.5,
    },
  };
  const onUpdateCallback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update correctly when speed selection change with data binding', () => {
    accessStore('default').setState(baseState);

    const rendered = render(<SpeedEditor component={component} onUpdateCallback={onUpdateCallback} />);
    const polarisWrapper = wrapper(rendered.container);

    expect(rendered.queryByTestId('DataBindingEditor')).toBeTruthy();

    const select = polarisWrapper.findSelect('[data-testid="motion-indicator-speed-select"]');

    select!.openDropdown();
    select!.selectOptionByValue('default');

    expect(rendered.queryByTestId('DataBindingEditor')).toBeFalsy();
    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        valueDataBindings: {
          ...component.valueDataBindings,
          [Component.MotionIndicatorDataBindingName.Speed]: undefined,
        },
      },
      true,
    );

    // call update to clear default value when use binding is selected
    select!.openDropdown();
    select!.selectOptionByValue('binding');
    expect(onUpdateCallback).toBeCalledTimes(2);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        config: {
          ...component.config,
          defaultSpeed: undefined,
        },
      },
      true,
    );
  });

  it('should slider update speed correctly', () => {
    accessStore('default').setState(baseState);

    const rendered = render(
      <SpeedEditor component={{ ...component, valueDataBindings: {} }} onUpdateCallback={onUpdateCallback} />,
    );

    fireEvent.click(rendered.getByTestId('motion-indicator-speed-slider-button'));
    sliderOnChangeCb({ target: { value: 3 } });

    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        valueDataBindings: {},
        config: { ...component.config, defaultSpeed: 3 },
      },
      true,
    );
  });
});
