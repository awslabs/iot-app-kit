import { trimWidgetPosition } from './trimWidgetPosition';

it('rounds the position to the nearest decimal', () => {
  expect(
    trimWidgetPosition({
      x: 1.01,
      y: 1.99,
      width: 10,
      height: 20,
      id: 'some-id',
      widget: 'some-widget',
    })
  ).toEqual(
    expect.objectContaining({
      x: 1,
      y: 2,
    })
  );
});

it('rounds the width and height to the nearest decimal', () => {
  expect(
    trimWidgetPosition({
      x: 1,
      y: 2,
      width: 10.49,
      height: 20.59,
      id: 'some-id',
      widget: 'some-widget',
    })
  ).toEqual(
    expect.objectContaining({
      width: 10,
      height: 21,
    })
  );
});

it('does nothing to widgets with integer based position and dimensions', () => {
  expect(
    trimWidgetPosition({
      x: 1,
      y: 2,
      width: 10,
      height: 20,
      id: 'some-id',
      widget: 'some-widget',
    })
  ).toEqual(
    expect.objectContaining({
      width: 10,
      height: 20,
      x: 1,
      y: 2,
    })
  );
});
