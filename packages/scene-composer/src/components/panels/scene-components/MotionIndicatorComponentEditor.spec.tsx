import { render } from '@/tests/testing-library';
import wrapper from '@cloudscape-design/components/test-utils/dom';
import { mockComponent, mockNode } from '../../../../tests/components/panels/scene-components/MockComponents';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { type IMotionIndicatorComponentInternal, accessStore } from '../../../store';
import { MotionIndicatorComponentEditor } from './MotionIndicatorComponentEditor';

vi.mock('./motion-indicator/SpeedEditor', async () => {
  const originalModule = await vi.importActual('./motion-indicator/SpeedEditor');
  return {
    ...originalModule,
    SpeedEditor: (...props: any[]) => <div id='SpeedEditor'>{JSON.stringify(props)}</div>,
  };
});

vi.mock('./motion-indicator/AppearanceEditor', () => ({
  default: (...props: any[]) => <div id='AppearanceEditor'>{JSON.stringify(props)}</div>,
}));

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

const updateComponentInternalFn = vi.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
};

describe('MotionIndicatorComponentEditor', () => {
  const component: IMotionIndicatorComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.MotionIndicator,
    shape: Component.MotionIndicatorShape.LinearCylinder,
    valueDataBindings: {},
    config: {
      numOfRepeatInY: 4,
      backgroundColorOpacity: 0.5,
    },
  };

  it('should change shape selection and trigger update component call', () => {
    accessStore('default').setState(baseState);

    const { container } = render(
      <MotionIndicatorComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    const polarisWrapper = wrapper(container);

    const select = polarisWrapper.findSelect('[data-testid="motion-indicator-shape-select"]');
    select!.openDropdown();
    select!.selectOption(1);

    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ...component,
        shape: Component.MotionIndicatorShape.LinearPlane,
      },
      true,
    );
  });
});
