import { type DashboardWidget } from '../../../types';
import { getCorrectSelectionMode } from './getCorrectSelectionMode';

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

describe('Get correct selection mode', () => {
  it('returns single if kpi', () => {
    expect(getCorrectSelectionMode([createMockWidget('kpi')])).toBe('single');
  });

  it('returns single if gauge', () => {
    expect(getCorrectSelectionMode([createMockWidget('gauge')])).toBe('single');
  });

  it('returns multi if line', () => {
    expect(getCorrectSelectionMode([createMockWidget('xy-plot')])).toBe(
      'multi'
    );
  });

  it('returns multi if bar', () => {
    expect(getCorrectSelectionMode([createMockWidget('bar-chart')])).toBe(
      'multi'
    );
  });
});
