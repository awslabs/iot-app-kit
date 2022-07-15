import { MockWidgetFactory } from '../../testing/mocks';
import { trimWidgetPosition } from './trimWidgetPosition';

it('rounds the position to the nearest decimal', () => {
  expect(
    trimWidgetPosition(
      MockWidgetFactory.getKpiWidget({
        x: 1.01,
        y: 1.99,
        width: 10,
        height: 20,
        id: 'some-id',
      })
    )
  ).toEqual(
    expect.objectContaining({
      x: 1,
      y: 2,
    })
  );
});

it('rounds the width and height to the nearest decimal', () => {
  expect(
    trimWidgetPosition(
      MockWidgetFactory.getKpiWidget({
        x: 1,
        y: 2,
        width: 10.49,
        height: 20.59,
        id: 'some-id',
      })
    )
  ).toEqual(
    expect.objectContaining({
      width: 10,
      height: 21,
    })
  );
});

it('does nothing to widgets with integer based position and dimensions', () => {
  expect(
    trimWidgetPosition(
      MockWidgetFactory.getKpiWidget({
        x: 1,
        y: 2,
        width: 10,
        height: 20,
        id: 'some-id',
      })
    )
  ).toEqual(
    expect.objectContaining({
      width: 10,
      height: 20,
      x: 1,
      y: 2,
    })
  );
});
