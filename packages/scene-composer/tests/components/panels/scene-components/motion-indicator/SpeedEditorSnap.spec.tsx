import { fireEvent, render } from '@testing-library/react';

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
    DataBindingEditor: (...props: any[]) => <div id='DataBindingEditor'>{JSON.stringify(props)}</div>,
  };
});

vi.mock('../../../../../src/components/panels/Slider', async () => {
  const originalModule = await vi.importActual('../../../../../src/components/panels/Slider');
  return {
    ...originalModule,
    Slider: (...props: any[]) => <div id='Slider'>{JSON.stringify(props)}</div>,
  };
});

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

  it('should render correctly with data binding', () => {
    accessStore('default').setState(baseState);

    const { container } = render(<SpeedEditor component={component} onUpdateCallback={onUpdateCallback} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly without data binding', () => {
    accessStore('default').setState(baseState);

    const rendered = render(
      <SpeedEditor component={{ ...component, valueDataBindings: {} }} onUpdateCallback={onUpdateCallback} />,
    );

    expect(rendered.container).toMatchSnapshot();
  });

  it('should render correctly with slider shown', () => {
    accessStore('default').setState(baseState);

    const rendered = render(
      <SpeedEditor component={{ ...component, valueDataBindings: {} }} onUpdateCallback={onUpdateCallback} />,
    );

    fireEvent.click(rendered.getByTestId('motion-indicator-speed-slider-button'));

    expect(rendered.container).toMatchSnapshot();
  });
});
