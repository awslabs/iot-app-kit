import { render } from '@testing-library/react';
import wrapper from '@cloudscape-design/components/test-utils/dom';

import { mockComponent, mockProvider } from '../MockComponents';
import { type IMotionIndicatorComponentInternal, accessStore } from '../../../../../src/store';
import { KnownComponentType } from '../../../../../src/interfaces';
import { Component } from '../../../../../src/models/SceneModels';
import { DataBindingEditor } from '../../../../../src/components/panels/scene-components/motion-indicator/DataBindingEditor';

let builderOnChangeCb;
vi.mock('../../../../../src/components/panels/scene-components/common/ValueDataBindingBuilder', async () => {
  const originalModule = await vi.importActual(
    '../../../../../src/components/panels/scene-components/common/ValueDataBindingBuilder',
  );
  return {
    ...originalModule,
    ValueDataBindingBuilder: (...props: any[]) => {
      builderOnChangeCb = props[0].onChange;
      return <div data-testid='ValueDataBindingBuilder'>{JSON.stringify(props)}</div>;
    },
  };
});

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

const baseState = {
  listSceneRuleMapIds: vi.fn(),
} as any;

describe('DataBindingEditor', () => {
  const component: IMotionIndicatorComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.MotionIndicator,
    shape: Component.MotionIndicatorShape.LinearPlane,
    valueDataBindings: {
      [Component.MotionIndicatorDataBindingName.ForegroundColor]: { ruleBasedMapId: 'rule-2' },
    },
    config: {
      numOfRepeatInY: 4,
      backgroundColorOpacity: 0.5,
    },
  };
  const onUpdateCallback = vi.fn();
  const mockRules = ['rule-1', 'rule-2'];

  beforeEach(() => {
    vi.clearAllMocks();
    baseState.listSceneRuleMapIds.mockReturnValue(mockRules);
  });

  it('should update correctly when rule selection changed', () => {
    accessStore('default').setState(baseState);

    const rendered = render(
      <DataBindingEditor
        component={component}
        dataBindingName={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
        valueDataBindingProvider={mockProvider}
      />,
    );
    const polarisWrapper = wrapper(rendered.container);

    const select = polarisWrapper.findSelect(
      `[data-testid="motion-indicator-${Component.MotionIndicatorDataBindingName.ForegroundColor}-rule-id-select"]`,
    );

    select!.openDropdown();
    select!.selectOptionByValue('rule-1');

    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        valueDataBindings: {
          ...component.valueDataBindings,
          [Component.MotionIndicatorDataBindingName.ForegroundColor]: {
            ...component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor],
            ruleBasedMapId: 'rule-1',
          },
        },
      },
      true,
    );
  });

  it('should update correctly when data binding changed', () => {
    accessStore('default').setState(baseState);

    render(
      <DataBindingEditor
        component={component}
        dataBindingName={Component.MotionIndicatorDataBindingName.ForegroundColor}
        onUpdateCallback={onUpdateCallback}
        valueDataBindingProvider={mockProvider}
      />,
    );
    const mockNewBinding = { test: '123' };

    builderOnChangeCb(mockNewBinding);

    expect(onUpdateCallback).toBeCalledTimes(1);
    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        valueDataBindings: {
          ...component.valueDataBindings,
          [Component.MotionIndicatorDataBindingName.ForegroundColor]: {
            ...component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor],
            valueDataBinding: mockNewBinding,
          },
        },
      },
      true,
    );
  });
});
