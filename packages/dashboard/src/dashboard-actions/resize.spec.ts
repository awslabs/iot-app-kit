import { resize } from './resize';

it('returns nothing when provided empty dashboard', () => {
  expect(
    resize({
      dashboardConfiguration: [],
      cellSize: 10,
      changeInPosition: { x: 0, y: 0 },
      widgetIds: [],
      anchor: 'left',
    })
  ).toEqual([]);
});

describe('top-left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 2,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-left',
      })
    ).toEqual([
      {
        x: 2,
        y: 2,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('does stretch widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: -10 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 2,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-left',
      })
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

  it('does shrink widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-left',
      })
    ).toEqual([
      {
        x: 2,
        y: 2,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('does resize multiple widgets', () => {
    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: -20 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 3,
            height: 1,
            width: 1,
            id: 'rect-1',
            widget: 'line-chart',
          },
          {
            x: 2,
            y: 4,
            height: 1,
            width: 1,
            id: 'rect-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-left',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 2,
        width: 2,
        id: 'rect-1',
        widget: 'line-chart',
      },
      {
        x: 1,
        y: 3,
        height: 2,
        width: 2,
        id: 'rect-2',
        widget: 'line-chart',
      },
    ]);
  });
});

describe('right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches single widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 2,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'right',
      })
    ).toEqual([
      {
        x: 1,
        y: 2,
        height: 1,
        width: 2,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('shrinks single widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 2,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('resizes multiple widgets', () => {
    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'rect-1',
            widget: 'line-chart',
          },
          {
            x: 2,
            y: 2,
            height: 1,
            width: 1,
            id: 'rect-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        width: 0.5,
        height: 1,
        id: 'rect-1',
        widget: 'line-chart',
      },
      {
        x: 1.5,
        y: 2,
        height: 1,
        width: 0.5,
        id: 'rect-2',
        widget: 'line-chart',
      },
    ]);
  });
});

describe('top anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches single widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 2,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 2,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('shrinks single widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top',
      })
    ).toEqual([
      {
        x: 1,
        y: 2,
        height: 1,
        width: 2,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('resizes multiple widgets', () => {
    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'rect-1',
            widget: 'line-chart',
          },
          {
            x: 2,
            y: 2,
            height: 1,
            width: 1,
            id: 'rect-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'top',
      })
    ).toEqual([
      {
        x: 1,
        y: 2,
        width: 1,
        height: 0.5,
        id: 'rect-1',
        widget: 'line-chart',
      },
      {
        x: 2,
        y: 2.5,
        height: 0.5,
        width: 1,
        id: 'rect-2',
        widget: 'line-chart',
      },
    ]);
  });
});

describe('top-right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches single widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 2,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-right',
      })
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

  it('shrinks single widget', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-right',
      })
    ).toEqual([
      {
        x: 1,
        y: 2,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('resizes multiple widgets', () => {
    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'rect-1',
            widget: 'line-chart',
          },
          {
            x: 2,
            y: 2,
            height: 1,
            width: 1,
            id: 'rect-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'top-right',
      })
    ).toEqual([
      {
        x: 1,
        y: 2,
        width: 0.5,
        height: 0.5,
        id: 'rect-1',
        widget: 'line-chart',
      },
      {
        x: 1.5,
        y: 2.5,
        height: 0.5,
        width: 0.5,
        id: 'rect-2',
        widget: 'line-chart',
      },
    ]);
  });
});

describe('left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'left',
      })
    ).toEqual([
      {
        x: 2,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches single rectangle', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'left',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 2,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('shrinks single rectangle', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'left',
      })
    ).toEqual([
      {
        x: 2,
        y: 1,
        height: 2,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches multiple rectangles', () => {
    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -20, y: 20 },
        dashboardConfiguration: [
          {
            x: 3,
            y: 1,
            height: 1,
            width: 1,
            id: 'rect-1',
            widget: 'line-chart',
          },
          {
            x: 4,
            y: 2,
            height: 1,
            width: 1,
            id: 'rect-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'left',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 2,
        id: 'rect-1',
        widget: 'line-chart',
      },
      {
        x: 3,
        y: 2,
        height: 1,
        width: 2,
        id: 'rect-2',
        widget: 'line-chart',
      },
    ]);
  });
});

describe('bottom-left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-left',
      })
    ).toEqual([
      {
        x: 2,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches single rectangle', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-left',
      })
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

  it('shrinks single rectangle', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-left',
      })
    ).toEqual([
      {
        x: 2,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches multiple rectangles', () => {
    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -20, y: 20 },
        dashboardConfiguration: [
          {
            x: 3,
            y: 1,
            height: 1,
            width: 1,
            id: 'rect-1',
            widget: 'line-chart',
          },
          {
            x: 4,
            y: 2,
            height: 1,
            width: 1,
            id: 'rect-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-left',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 2,
        width: 2,
        id: 'rect-1',
        widget: 'line-chart',
      },
      {
        x: 3,
        y: 3,
        height: 2,
        width: 2,
        id: 'rect-2',
        widget: 'line-chart',
      },
    ]);
  });
});

describe('bottom anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom',
      })
    ).toEqual([
      {
        x: 2,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches single rectangle', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration: [
          {
            x: 2,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom',
      })
    ).toEqual([
      {
        x: 2,
        y: 1,
        height: 2,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('shrinks single rectangle', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 2,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches multiple rectangles', () => {
    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -20, y: 20 },
        dashboardConfiguration: [
          {
            x: 3,
            y: 1,
            height: 1,
            width: 1,
            id: 'rect-1',
            widget: 'line-chart',
          },
          {
            x: 4,
            y: 2,
            height: 1,
            width: 1,
            id: 'rect-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom',
      })
    ).toEqual([
      {
        x: 3,
        y: 1,
        height: 2,
        width: 1,
        id: 'rect-1',
        widget: 'line-chart',
      },
      {
        x: 4,
        y: 3,
        height: 2,
        width: 1,
        id: 'rect-2',
        widget: 'line-chart',
      },
    ]);
  });
});

describe('bottom-right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches single widget to double the size', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: 10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-right',
      })
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

  it('shrinks single widget to half the size', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: -10 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 1,
        width: 1,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('shrinks single widget to a dot', () => {
    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -20, y: -20 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            id: 'some-id',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 0,
        width: 0,
        id: 'some-id',
        widget: 'line-chart',
      },
    ]);
  });

  it('stretches two identical squares by a factor of two ', () => {
    expect(
      resize({
        widgetIds: ['sqr-1', 'sqr-2'],
        cellSize: 10,
        changeInPosition: { x: 20, y: 20 },
        dashboardConfiguration: [
          {
            x: 1,
            y: 1,
            height: 1,
            width: 1,
            id: 'sqr-1',
            widget: 'line-chart',
          },
          {
            x: 2,
            y: 2,
            height: 1,
            width: 1,
            id: 'sqr-2',
            widget: 'line-chart',
          },
        ],
        anchor: 'bottom-right',
      })
    ).toEqual([
      {
        x: 1,
        y: 1,
        height: 2,
        width: 2,
        id: 'sqr-1',
        widget: 'line-chart',
      },
      {
        x: 3,
        y: 3,
        height: 2,
        width: 2,
        id: 'sqr-2',
        widget: 'line-chart',
      },
    ]);
  });
});
