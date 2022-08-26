import { MockDashboardFactory, MockWidgetFactory } from '../../testing/mocks';
import { BringToFrontAction, DashboardActionType, onBringToFrontAction } from '../actions';
import { bringToFront } from '../bringToFront';
import { reverseBringToFront } from './reverseBringToFront';

it('returns a change layer action for the specified widget', () => {
  const widgets = [MockWidgetFactory.getKpiWidget({ z: 2 }), MockWidgetFactory.getKpiWidget({ z: 1 })];
  const dashboardConfiguration = bringToFront({
    dashboardConfiguration: MockDashboardFactory.get({ widgets }),
    widgetIds: [widgets[1].id],
  });
  const action: BringToFrontAction = onBringToFrontAction({
    widgets: [widgets[1]],
  });
  expect(reverseBringToFront({ dashboardConfiguration, action })).toEqual({
    payload: { widgets: [widgets[1]], zOffset: -2 },
    type: DashboardActionType.CHANGE_LAYER,
  });
});

it('returns a change layer action for multiple widgets', () => {
  const widgets = [
    MockWidgetFactory.getKpiWidget({ z: 3 }),
    MockWidgetFactory.getKpiWidget({ z: 2 }),
    MockWidgetFactory.getKpiWidget({ z: 1 }),
  ];
  const dashboardConfiguration = bringToFront({
    dashboardConfiguration: MockDashboardFactory.get({ widgets }),
    widgetIds: [widgets[1].id, widgets[2].id],
  });
  const action: BringToFrontAction = onBringToFrontAction({
    widgets: [widgets[1], widgets[2]],
  });
  expect(reverseBringToFront({ dashboardConfiguration, action })).toEqual({
    payload: { widgets: [widgets[1], widgets[2]], zOffset: -3 },
    type: DashboardActionType.CHANGE_LAYER,
  });
});
