/* eslint-disable */
import React from 'react';
import renderer from 'react-test-renderer';

jest.doMock('../../../../src/components/three-fiber/motion-indicator/LinearPlaneMotionIndicator', () => ({
  LinearPlaneMotionIndicator: (...props: any[]) => <div data-testid={'linear-plane'}>{JSON.stringify(props)}</div>,
}));

const mockGetSceneResourceInfo = jest.fn();
jest.doMock('../../../../src/utils/sceneResourceUtils', () => {
  const originalModule = jest.requireActual('../../../../src/utils/sceneResourceUtils');
  return {
    ...originalModule,
    getSceneResourceInfo: mockGetSceneResourceInfo,
  };
});

const mockDataBindingValuesProvider = jest.fn();
const mockRuleEvaluator = jest.fn();
jest.doMock('../../../../src/utils/dataBindingUtils', () => {
  const originalModule = jest.requireActual('../../../../src/utils/dataBindingUtils');
  return {
    ...originalModule,
    dataBindingValuesProvider: mockDataBindingValuesProvider,
    ruleEvaluator: mockRuleEvaluator,
  };
});

import { MotionIndicatorComponent } from '../../../../src/components/three-fiber/motion-indicator/MotionIndicatorComponent';
import { useStore } from '../../../../src/store';
import { SceneResourceType } from '../../../../src/interfaces';
import { Component } from '../../../../src/SceneModels';

/* eslint-enable */

describe('MotionIndicatorComponent', () => {
  const mockGetSceneRuleMapById = jest.fn();
  const mockGetObject3DBySceneNodeRef = jest.fn();

  const baseState = {
    getSceneRuleMapById: mockGetSceneRuleMapById,
    getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
    dataInput: undefined,
  };

  const mockNode: any = { ref: 'node-ref', transform: { scale: [1, 2, 3] } };
  const mockComponent: any = {
    shape: 'LinearPlane',
    valueDataBindings: {
      [Component.MotionIndicatorDataBindingName.Speed]: {
        ruleBasedMapId: 40,
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      },
      [Component.MotionIndicatorDataBindingName.ForegroundColor]: {
        ruleBasedMapId: 41,
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      },
      [Component.MotionIndicatorDataBindingName.BackgroundColor]: {
        ruleBasedMapId: 42,
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      },
    },
    config: {
      numOfRepeatInY: 2,
      defaultForegroundColor: 'red',
      defaultBackgroundColor: 'blue',
      defaultSpeed: 6,
      backgroundColorOpacity: 1,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();

    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Color, value: 'black' });
    mockDataBindingValuesProvider.mockReturnValue({});
    mockRuleEvaluator.mockReturnValue(3);
  });

  const createComponent = (overrides?) => {
    return <MotionIndicatorComponent node={mockNode} component={mockComponent} {...overrides} />;
  };

  it('should render with correct speed and values from rule evaluating', async () => {
    useStore('default').setState(baseState);

    const container = renderer.create(createComponent());
    expect(container).toMatchSnapshot();
  });

  it('should render with correct default values from config when dataBinding not set', async () => {
    useStore('default').setState(baseState);
    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Icon });

    const container = renderer.create(createComponent({ component: { ...mockComponent, valueDataBindings: {} } }));
    expect(container).toMatchSnapshot();
  });
});
