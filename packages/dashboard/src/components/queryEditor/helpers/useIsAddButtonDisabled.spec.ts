import { type DashboardWidget } from '~/types';
import { useIsAddButtonDisabled } from './useIsAddButtonDisabled';
import * as hooks from '../useQuery';

const createMockWidget = (widgetType: string): DashboardWidget => {
  return {
    type: widgetType,
    id: 'test-id',
    x: 0,
    y: 0,
    z: 0,
    height: 20,
    width: 20,
    properties: {},
  };
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: () => jest.fn(),
}));

jest.mock('../useQuery', () => ({
  useQuery: jest.fn(() => [{}, jest.fn()]),
}));

describe('Add button disbale state on widget and resource selection', () => {
  it('Enabled with no widgets', () => {
    expect(useIsAddButtonDisabled([])).toBe(false);
  });

  it('Enabled with line widget', () => {
    expect(useIsAddButtonDisabled([createMockWidget('xy-plot')])).toBe(false);
  });

  it('Enabled with KPI with no query', () => {
    expect(useIsAddButtonDisabled([createMockWidget('kpi')])).toBe(false);
  });

  it('Disabled with KPI with query', () => {
    const query = { assets: [{ assetId: '1234', properties: [] }] };
    jest
      .spyOn(hooks, 'useQuery')
      .mockImplementationOnce(() => [query, jest.fn()]);
    expect(useIsAddButtonDisabled([createMockWidget('kpi')])).toBe(true);
  });
});
