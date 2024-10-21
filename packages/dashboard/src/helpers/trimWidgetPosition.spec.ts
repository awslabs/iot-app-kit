import { MockWidgetFactory } from '../../testing/mocks';
import { trimRectPosition } from './trimRectPosition';

it('rounds the position to the nearest decimal', () => {
  expect(
    trimRectPosition(
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
    trimRectPosition(
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

it('prevents a widgets size from being 0', () => {
  expect(
    trimRectPosition(
      MockWidgetFactory.getKpiWidget({
        x: 1,
        y: 2,
        width: 0.3,
        height: 0.3,
        id: 'some-id',
      })
    )
  ).toEqual(
    expect.objectContaining({
      width: 1,
      height: 1,
    })
  );
});

it('does nothing to widgets with integer based position and dimensions', () => {
  expect(
    trimRectPosition(
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
