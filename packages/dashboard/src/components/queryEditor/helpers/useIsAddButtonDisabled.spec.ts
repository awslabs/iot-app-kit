import { useIsAddButtonDisabled } from './useIsAddButtonDisabled';
import * as hooks from '../iotSiteWiseQueryEditor/useQuery/useQuery';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

const createMockWidget = <WidgetType extends RegisteredWidgetType>(
  widgetType: WidgetType
): WidgetInstance<WidgetType> => {
  return {
    type: widgetType,
    id: 'test-id',
    x: 0,
    y: 0,
    z: 0,
    height: 20,
    width: 20,
    properties: {},
  } as WidgetInstance<WidgetType>;
};

vi.mock('react-redux', async () => ({
  ...(await vi.importActual('react-redux')),
  useDispatch: () => vi.fn(),
  useSelector: () => vi.fn(),
}));

vi.mock('../useQuery', () => ({
  useQuery: vi.fn(() => [{}, vi.fn()]),
}));

describe('Add button disbale state on widget and resource selection', () => {
  it('Disabled with no widget-instance', () => {
    expect(useIsAddButtonDisabled([])).toBe(true);
  });

  it('Enabled with line widget', () => {
    expect(useIsAddButtonDisabled([createMockWidget('xy-plot')])).toBe(false);
  });

  it('Enabled with KPI with no query', () => {
    expect(useIsAddButtonDisabled([createMockWidget('kpi')])).toBe(false);
  });

  it('Disabled with KPI with query', () => {
    const query = { assets: [{ assetId: '1234', properties: [] }] };
    vi.spyOn(hooks, 'useQuery').mockImplementationOnce(() => [query, vi.fn()]);
    expect(useIsAddButtonDisabled([createMockWidget('kpi')])).toBe(true);
  });
});
