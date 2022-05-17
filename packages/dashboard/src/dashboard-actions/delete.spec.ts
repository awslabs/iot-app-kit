import { deleteWidgets } from './delete';
import { MOCK_WIDGET } from '../testing/mocks';

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
      dashboardConfiguration: [MOCK_WIDGET],
      widgetIdsToDelete: [],
    })
  ).toEqual([MOCK_WIDGET]);
});

it('removes widgets to be delete from dashboard configuration', () => {
  expect(
    deleteWidgets({
      dashboardConfiguration: [MOCK_WIDGET],
      widgetIdsToDelete: [MOCK_WIDGET.id],
    })
  ).toEqual([]);
});

it('does not remove any widgets when widget id specified is not present in the dashbaord configuration', () => {
  expect(
    deleteWidgets({
      dashboardConfiguration: [MOCK_WIDGET],
      widgetIdsToDelete: ['fake'],
    })
  ).toEqual([MOCK_WIDGET]);
});

it('only deletes widget that is specified to be deleted when there are multiple widgets present', () => {
  const WIDGET_2 = { ...MOCK_WIDGET, id: 'widget-2' };
  expect(
    deleteWidgets({
      dashboardConfiguration: [MOCK_WIDGET, WIDGET_2],
      widgetIdsToDelete: [MOCK_WIDGET.id],
    })
  ).toEqual([WIDGET_2]);
});
