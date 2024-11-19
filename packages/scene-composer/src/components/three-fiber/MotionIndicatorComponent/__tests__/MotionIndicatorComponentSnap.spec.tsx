import { render } from '@testing-library/react';

import { SceneResourceType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { accessStore } from '../../../../store';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../../utils/dataBindingUtils';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import MotionIndicatorComponent from '../MotionIndicatorComponent';

vi.mock('../../../../hooks/useBindingData', () => vi.fn().mockReturnValue({ data: [{ alarm_status: 'ACTIVE' }] }));

vi.mock('../LinearPlaneMotionIndicator', () => ({
  LinearPlaneMotionIndicator: (...props: any[]) => <div data-testid='linear-plane'>{JSON.stringify(props)}</div>,
}));

const mockGetSceneResourceInfo = getSceneResourceInfo as vi.Mock;
vi.mock('../../../../utils/sceneResourceUtils', async () => {
  const originalModule = await vi.importActual('../../../../utils/sceneResourceUtils');
  return {
    ...originalModule,
    getSceneResourceInfo: vi.fn(),
  };
});

const mockDataBindingValuesProvider = dataBindingValuesProvider as vi.Mock;
const mockRuleEvaluator = ruleEvaluator as vi.Mock;
vi.mock('../../../../utils/dataBindingUtils', async () => {
  const originalModule = await vi.importActual('../../../../utils/dataBindingUtils');
  return {
    ...originalModule,
    dataBindingValuesProvider: vi.fn(),
    ruleEvaluator: vi.fn(),
  };
});

describe('MotionIndicatorComponent', () => {
  const mockGetSceneRuleMapById = vi.fn();
  const mockGetObject3DBySceneNodeRef = vi.fn();

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
    vi.clearAllMocks();

    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Color, value: 'black' });
    mockDataBindingValuesProvider.mockReturnValue({});
    mockRuleEvaluator.mockReturnValue({ target: 3 });
    mockGetSceneRuleMapById.mockImplementation((id) => id);
  });

  it('should render with correct speed and values from rule evaluating', async () => {
    accessStore('default').setState(baseState);

    const { container } = render(<MotionIndicatorComponent node={mockNode} component={mockComponent} />);

    expect(container).toMatchSnapshot();
    expect(mockRuleEvaluator).toBeCalledTimes(3);
    expect(mockRuleEvaluator).toHaveBeenNthCalledWith(1, 0, { alarm_status: 'ACTIVE' }, 40);
    expect(mockRuleEvaluator).toHaveBeenNthCalledWith(2, '', {}, 41);
    expect(mockRuleEvaluator).toHaveBeenNthCalledWith(3, '', {}, 42);
    expect(mockDataBindingValuesProvider).toBeCalledTimes(2);
  });

  it('should render with correct default values from config when dataBinding not set', async () => {
    accessStore('default').setState(baseState);
    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Icon });

    const container = render(
      <MotionIndicatorComponent node={mockNode} component={{ ...mockComponent, valueDataBindings: {} }} />,
    );
    expect(container).toMatchSnapshot();
    expect(mockRuleEvaluator).not.toBeCalled();
    expect(mockDataBindingValuesProvider).not.toBeCalled();
  });
});
