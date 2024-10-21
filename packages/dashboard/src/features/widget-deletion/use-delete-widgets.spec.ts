import { deleteWidgets } from '~/store/dashboard/reducer';
import { stateWithWidgets } from '~/test/state-scenarios';
import { act, renderHook } from '~/test/testing-library';
import { useDeleteWidgets } from './use-delete-widgets';

test('delete widgets', () => {
  const { result, dispatchSpy } = renderHook(() => useDeleteWidgets(), {
    preloadedState: stateWithWidgets,
  });

  act(() => {
    result.current({
      widgetIds:
        stateWithWidgets.dashboard.present.dashboardConfiguration.widgets.map(
          ({ id }) => id
        ),
    });
  });

  expect(dispatchSpy).toHaveBeenCalledWith(
    deleteWidgets({
      widgetIds:
        stateWithWidgets.dashboard.present.dashboardConfiguration.widgets.map(
          ({ id }) => id
        ),
    })
  );
});
