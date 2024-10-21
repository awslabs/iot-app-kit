import { MockWidgetFactory } from '../../testing/mocks';
import { constrainWidgetPositionToGrid } from './constrainWidgetPositionToGrid';

it('prevents a widget from overflowing the sides', () => {
  expect(
    constrainWidgetPositionToGrid(
      {
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      },
      MockWidgetFactory.getKpiWidget({
        x: 15,
        y: 10,
        width: 10,
        height: 5,
      })
    )
  ).toEqual(
    expect.objectContaining({
      x: 10,
      y: 10,
      width: 10,
      height: 5,
    })
  );

  expect(
    constrainWidgetPositionToGrid(
      {
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      },
      MockWidgetFactory.getKpiWidget({
        x: -5,
        y: 10,
        width: 10,
        height: 5,
      })
    )
  ).toEqual(
    expect.objectContaining({
      x: 0,
      y: 10,
      width: 10,
      height: 5,
    })
  );

  expect(
    constrainWidgetPositionToGrid(
      {
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      },
      MockWidgetFactory.getKpiWidget({
        x: 10,
        y: -5,
        width: 5,
        height: 10,
      })
    )
  ).toEqual(
    expect.objectContaining({
      x: 10,
      y: 0,
      width: 5,
      height: 10,
    })
  );

  expect(
    constrainWidgetPositionToGrid(
      {
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      },
      MockWidgetFactory.getKpiWidget({
        x: 10,
        y: 15,
        width: 5,
        height: 10,
      })
    )
  ).toEqual(
    expect.objectContaining({
      x: 10,
      y: 10,
      width: 5,
      height: 10,
    })
  );
});

it('prevents a widget from being placed completely outside the grid', () => {
  expect(
    constrainWidgetPositionToGrid(
      {
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      },
      MockWidgetFactory.getKpiWidget({
        x: 30,
        y: 30,
        width: 5,
        height: 5,
      })
    )
  ).toEqual(
    expect.objectContaining({
      x: 15,
      y: 15,
      width: 5,
      height: 5,
    })
  );
});
