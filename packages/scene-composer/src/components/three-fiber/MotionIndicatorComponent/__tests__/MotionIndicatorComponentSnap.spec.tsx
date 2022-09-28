import React from 'react';
import { render } from '@testing-library/react';

import MotionIndicatorComponent from '../MotionIndicatorComponent';
import { useStore } from '../../../../store';
import { SceneResourceType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../../utils/dataBindingUtils';

jest.mock('../LinearPlaneMotionIndicator', () => ({
  LinearPlaneMotionIndicator: (...props: any[]) => <div data-testid={'linear-plane'}>{JSON.stringify(props)}</div>,
}));

const mockGetSceneResourceInfo = getSceneResourceInfo as jest.Mock;
jest.mock('../../../../utils/sceneResourceUtils', () => {
  const originalModule = jest.requireActual('../../../../utils/sceneResourceUtils');
  return {
    ...originalModule,
    getSceneResourceInfo: jest.fn(),
  };
});

const mockDataBindingValuesProvider = dataBindingValuesProvider as jest.Mock;
const mockRuleEvaluator = ruleEvaluator as jest.Mock;
jest.mock('../../../../utils/dataBindingUtils', () => {
  const originalModule = jest.requireActual('../../../../utils/dataBindingUtils');
  return {
    ...originalModule,
    dataBindingValuesProvider: jest.fn(),
    ruleEvaluator: jest.fn(),
  };
});

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

  it('should render with correct speed and values from rule evaluating', async () => {
    useStore('default').setState(baseState);

    const { container } = render(<MotionIndicatorComponent node={mockNode} component={mockComponent} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with correct default values from config when dataBinding not set', async () => {
    useStore('default').setState(baseState);
    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Icon });

    const container = render(
      <MotionIndicatorComponent node={mockNode} component={{ ...mockComponent, valueDataBindings: {} }} />,
    );
    expect(container).toMatchSnapshot();
  });
});
