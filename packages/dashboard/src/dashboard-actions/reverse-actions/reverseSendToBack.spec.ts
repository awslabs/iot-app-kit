import { MockDashboardFactory, MockWidgetFactory } from '../../testing/mocks';
import { SendToBackAction, DashboardActionType, onSendToBackAction } from '../actions';
import { bringToBack } from '../bringToBack';
import { reverseSendToBack } from './reverseSendToBack';

it('returns a change layer action for the specified widget', () => {
  const widgets = [MockWidgetFactory.getKpiWidget({ z: 2 }), MockWidgetFactory.getKpiWidget({ z: 1 })];
  const dashboardConfiguration = bringToBack({
    dashboardConfiguration: MockDashboardFactory.get({ widgets }),
    widgetIds: [widgets[0].id],
  });
  const action: SendToBackAction = onSendToBackAction({
    widgets: [widgets[0]],
  });
  expect(reverseSendToBack({ dashboardConfiguration, action })).toEqual({
    payload: { widgets: [widgets[0]], zOffset: 2 },
    type: DashboardActionType.CHANGE_LAYER,
  });
});

it('returns a change layer action for multiple widgets', () => {
  const widgets = [
    MockWidgetFactory.getKpiWidget({ z: 3 }),
    MockWidgetFactory.getKpiWidget({ z: 2 }),
    MockWidgetFactory.getKpiWidget({ z: 1 }),
  ];
  const dashboardConfiguration = bringToBack({
    dashboardConfiguration: MockDashboardFactory.get({ widgets }),
    widgetIds: [widgets[0].id, widgets[1].id],
  });
  const action: SendToBackAction = onSendToBackAction({
    widgets: [widgets[0], widgets[1]],
  });
  expect(reverseSendToBack({ dashboardConfiguration, action })).toEqual({
    payload: { widgets: [widgets[0], widgets[1]], zOffset: 3 },
    type: DashboardActionType.CHANGE_LAYER,
  });
});
