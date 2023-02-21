import { updateViewport, onUpdateViewportAction } from '.';
import { initialState } from '../../state';

it('can update a live viewport', () => {
  expect(
    updateViewport(
      initialState,
      onUpdateViewportAction({
        viewport: { duration: '10 minutes' },
      })
    ).dashboardConfiguration.viewport
  ).toEqual({ duration: '10 minutes' });
});

it('can update a static viewport', () => {
  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 5);

  expect(
    updateViewport(
      initialState,
      onUpdateViewportAction({
        viewport: { start, end },
      })
    ).dashboardConfiguration.viewport
  ).toEqual({ start, end });
});
