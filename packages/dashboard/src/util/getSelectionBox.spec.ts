import { getSelectionBox } from './getSelectionBox';

it('returns no rectangle if no widget-instance', () => {
  expect(getSelectionBox([])).toBe(null);
});

it('returns exact dimensions of selected widget if only one widget is selected', () => {
  expect(
    getSelectionBox([
      MockWidgetFactory.getKpiWidget({
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      }),
    ])
  ).toEqual({
    x: 0,
    y: 0,
    width: 10,
    height: 10,
  });
});

it('returns rectangle that contains multiple rectangles', () => {
  const MOCK_WIDGET = MockWidgetFactory.getKpiWidget({
    id: 'some-widget',
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  });
  const MOCK_WIDGET_2 = MockWidgetFactory.getKpiWidget({
    id: 'some-widget-2',
    x: 100,
    y: 100,
    height: 10,
    width: 10,
  });

  expect(getSelectionBox([MOCK_WIDGET, MOCK_WIDGET_2])).toEqual({
    x: 0,
    y: 0,
    width: 110,
    height: 110,
  });
});
