import { type DashboardWidget } from '~/types';
import { useIsAddButtonDisabled } from './useIsAddButtonDisabled';
import { DataStreamQuery } from '@iot-app-kit/core';
import { AssetQuery } from '@iot-app-kit/source-iotsitewise';

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
type Query =
  | Partial<
      DataStreamQuery & {
        assets: AssetQuery[];
      }
    >
  | undefined;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: () => jest.fn(),
}));

const queryObject: {
  query: Query;
  setQuery: (query: Query) => void;
} = { query: undefined, setQuery: jest.fn() };

jest.mock('../useQuery', () => ({
  useQuery: jest.fn(() => [queryObject.query, queryObject.setQuery]),
}));

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
  queryObject.query = { assets: [{ assetId: '1234', properties: [] }] };
  useIsAddButtonDisabled([createMockWidget('kpi')]);
  expect(useIsAddButtonDisabled([createMockWidget('kpi')])).toBe(true);
});
