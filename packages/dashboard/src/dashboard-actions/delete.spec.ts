import { deleteWidgets } from './delete';
import { Widget } from '../types';

const WIDGET: Widget = {
  width: 10,
  height: 10,
  x: 10,
  y: 10,
  widget: 'line-chart',
  id: 'some-id',
};

it('returns no widgets when deleting widgets from an empty dashboard', () => {
  expect(
    deleteWidgets({
      dashboardConfiguration: [],
      widgetIdsToDelete: ['fake'],
    })
  ).toEqual([]);
});

it('returns original dashboard when no widgets are specified to be deleted', () => {
  expect(
    deleteWidgets({
      dashboardConfiguration: [WIDGET],
      widgetIdsToDelete: [],
    })
  ).toEqual([WIDGET]);
});

it('removes widgets to be delete from dashboard configuration', () => {
  expect(
    deleteWidgets({
      dashboardConfiguration: [WIDGET],
      widgetIdsToDelete: [WIDGET.id],
    })
  ).toEqual([]);
});

it('does not remove any widgets when widget id specified is not present in the dashbaord configuration', () => {
  expect(
    deleteWidgets({
      dashboardConfiguration: [WIDGET],
      widgetIdsToDelete: ['fake'],
    })
  ).toEqual([WIDGET]);
});

it('only deletes widget that is specified to be deleted when there are multiple widgets present', () => {
  const WIDGET_2 = { ...WIDGET, id: 'widget-2' };
  expect(
    deleteWidgets({
      dashboardConfiguration: [WIDGET, WIDGET_2],
      widgetIdsToDelete: [WIDGET.id],
    })
  ).toEqual([WIDGET_2]);
});
