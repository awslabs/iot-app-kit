import { render } from '@/tests/testing-library';

import { MotionIndicatorComponentEditor } from '../../../../src/components/panels/scene-components/MotionIndicatorComponentEditor';
import { KnownComponentType } from '../../../../src/interfaces';
import { type IMotionIndicatorComponentInternal, accessStore } from '../../../../src/store';
import { mockComponent, mockNode } from '../../../../tests/components/panels/scene-components/MockComponents';
import { Component } from '../../../models/SceneModels';

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

const updateComponentInternalFn = vi.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
};

describe('MotionIndicatorComponentEditor', () => {
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

  it('should render correctly', () => {
    accessStore('default').setState(baseState);

    const { container } = render(
      <MotionIndicatorComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    expect(container).toMatchSnapshot();
  });
});
