import { dashboardReducer } from './dashboardReducer';
import { onMoveAction } from './actions';
import { onDeleteAction, onResizeAction, onPasteAction } from '../types';

it('returns empty dashboard configuration when provided an empty dashboard', () => {
  expect(
    dashboardReducer(
      [],
      onMoveAction({
        widgetIds: [],
        cellSize: 10,
        position: { x: 10, y: 10 },
        prevPosition: { x: 14, y: 10 },
      })
    )
  ).toEqual([]);
});

it('applies move', () => {
  expect(
    dashboardReducer(
      [{ x: 1, y: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }],
      onMoveAction({
        widgetIds: ['some-id'],
        cellSize: 10,
        position: { x: 20, y: 10 },
        prevPosition: { x: 10, y: 10 },
      })
    )
  ).toEqual([{ x: 2, y: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }]);
});

it('applies resize', () => {
  expect(
    dashboardReducer(
      [
        {
          x: 2,
          y: 2,
          height: 1,
          width: 1,
          id: 'some-id',
          widget: 'line-chart',
        },
      ],
      onResizeAction({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: -10 },
        anchor: 'top-left',
      })
    )
  ).toEqual([
    {
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
      widget: 'line-chart',
    },
  ]);
});

it('applies delete', () => {
  expect(
    dashboardReducer(
      [
        {
          x: 2,
          y: 2,
          height: 1,
          width: 1,
          id: 'some-id',
          widget: 'line-chart',
        },
      ],
      onDeleteAction({
        widgetIds: ['some-id'],
      })
    )
  ).toEqual([]);
});

it('applies paste', () => {
  expect(
    dashboardReducer(
      [
        {
          x: 2,
          y: 2,
          height: 1,
          width: 1,
          id: 'some-id',
          widget: 'line-chart',
        },
      ],
      onPasteAction({
        copyGroup: [
          {
            x: 2,
            y: 2,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        numTimesCopyGroupHasBeenPasted: 0,
      })
    )
  ).toEqual([
    {
      x: 2,
      y: 2,
      height: 1,
      width: 1,
      id: 'some-id',
      widget: 'line-chart',
    },
    {
      ...{
        x: 2,
        y: 2,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
      id: expect.any(String),
      x: 3,
      y: 3,
    },
  ]);
});
