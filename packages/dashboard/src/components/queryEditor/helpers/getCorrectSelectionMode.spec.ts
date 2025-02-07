import { getCorrectSelectionMode } from './getCorrectSelectionMode';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';

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
