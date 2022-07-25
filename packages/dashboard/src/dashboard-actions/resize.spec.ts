import {
  MOCK_EMPTY_DASHBOARD,
  MOCK_LINE_CHART_WIDGET,
  MockWidgetFactory,
  MockDashboardFactory,
} from '../testing/mocks';
import { resize } from './resize';

it('returns nothing when provided empty dashboard', () => {
  expect(
    resize({
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
      cellSize: 10,
      changeInPosition: { x: 0, y: 0 },
      widgetIds: [],
      anchor: 'left',
    })
  ).toEqual(MOCK_EMPTY_DASHBOARD);
});

describe('top-left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const dashboardConfiguration = MockDashboardFactory.get({
      widgets: [MockWidgetFactory.getLineChartWidget({ x: 2, y: 2, height: 1, width: 1, id: 'some-id' })],
    });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'top-left',
      })
    ).toEqual(dashboardConfiguration);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: -10 },
        dashboardConfiguration,
        anchor: 'top-left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 2,
          width: 2,
        },
      ],
    });
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: 10 },
        dashboardConfiguration,
        anchor: 'top-left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 2,
          y: 2,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('does resize multiple widgets', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 3,
      height: 1,
      width: 1,
      id: 'rect-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 4,
      height: 1,
      width: 1,
      id: 'rect-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: -20 },
        dashboardConfiguration,
        anchor: 'top-left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 1, y: 1, height: 2, width: 2 },
        { ...WIDGET_B, x: 1, y: 3, height: 2, width: 2 },
      ],
    });
  });
});

describe('right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'right',
      })
    ).toEqual(dashboardConfiguration);
  });

  it('stretches single widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 2,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration,
        anchor: 'right',
      })
    ).toEqual({ ...dashboardConfiguration, widgets: [{ ...lineChartWidget, x: 1, y: 2, height: 1, width: 2 }] });
  });

  it('shrinks single widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'right',
      })
    ).toEqual({ ...dashboardConfiguration, widgets: [{ ...lineChartWidget, x: 1, y: 1, height: 2, width: 1 }] });
  });

  it('resizes multiple widgets', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'rect-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 1,
      width: 1,
      id: 'rect-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 1, y: 1, width: 0.5, height: 1 },
        { ...WIDGET_B, x: 1.5, y: 2, height: 1, width: 0.5 },
      ],
    });
  });
});

describe('top anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'top',
      })
    ).toEqual(dashboardConfiguration);
  });

  it('stretches single widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 2,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration,
        anchor: 'top',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [{ ...lineChartWidget, x: 1, y: 1, height: 2, width: 1 }],
    });
  });

  it('shrinks single widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'top',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 2,
          height: 1,
          width: 2,
        },
      ],
    });
  });

  it('resizes multiple widgets', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'rect-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 1,
      width: 1,
      id: 'rect-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'top',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 1, y: 2, width: 1, height: 0.5 },
        { ...WIDGET_B, x: 2, y: 2.5, height: 0.5, width: 1 },
      ],
    });
  });
});

describe('top-right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'top-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('stretches single widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 2,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration,
        anchor: 'top-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 2,
          width: 2,
        },
      ],
    });
  });

  it('shrinks single widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'top-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 2,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('resizes multiple widgets', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'rect-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 1,
      width: 1,
      id: 'rect-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'top-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 1, y: 2, width: 0.5, height: 0.5 },
        { ...WIDGET_B, x: 1.5, y: 2.5, height: 0.5, width: 0.5 },
      ],
    });
  });
});

describe('left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 2,
          y: 1,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('stretches single rectangle', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 1,
          width: 2,
        },
      ],
    });
  });

  it('shrinks single rectangle', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration,
        anchor: 'left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 2,
          y: 1,
          height: 2,
          width: 1,
        },
      ],
    });
  });

  it('stretches multiple rectangles', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 3,
      y: 1,
      height: 1,
      width: 1,
      id: 'rect-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 4,
      y: 2,
      height: 1,
      width: 1,
      id: 'rect-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -20, y: 20 },
        dashboardConfiguration,
        anchor: 'left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 1, y: 1, height: 1, width: 2 },
        { ...WIDGET_B, x: 3, y: 2, height: 1, width: 2 },
      ],
    });
  });
});

describe('bottom-left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'bottom-left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 2,
          y: 1,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('stretches single rectangle', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'bottom-left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 2,
          width: 2,
        },
      ],
    });
  });

  it('shrinks single rectangle', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration,
        anchor: 'bottom-left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 2,
          y: 1,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('stretches multiple rectangles', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 3,
      y: 1,
      height: 1,
      width: 1,
      id: 'rect-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 4,
      y: 2,
      height: 1,
      width: 1,
      id: 'rect-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -20, y: 20 },
        dashboardConfiguration,
        anchor: 'bottom-left',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 1, y: 1, height: 2, width: 2 },
        { ...WIDGET_B, x: 3, y: 3, height: 2, width: 2 },
      ],
    });
  });
});

describe('bottom anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'bottom',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 2,
          y: 1,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('stretches single rectangle', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: 10 },
        dashboardConfiguration,
        anchor: 'bottom',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 2,
          y: 1,
          height: 2,
          width: 1,
        },
      ],
    });
  });

  it('shrinks single rectangle', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: -10 },
        dashboardConfiguration,
        anchor: 'bottom',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 1,
          width: 2,
        },
      ],
    });
  });

  it('stretches multiple rectangles', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 3,
      y: 1,
      height: 1,
      width: 1,
      id: 'rect-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 4,
      y: 2,
      height: 1,
      width: 1,
      id: 'rect-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['rect-1', 'rect-2'],
        cellSize: 10,
        changeInPosition: { x: -20, y: 20 },
        dashboardConfiguration,
        anchor: 'bottom',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 3, y: 1, height: 2, width: 1 },
        { ...WIDGET_B, x: 4, y: 3, height: 2, width: 1 },
      ],
    });
  });
});

describe('bottom-right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 0, y: 0 },
        dashboardConfiguration,
        anchor: 'bottom-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('stretches single widget to double the size', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: 10, y: 10 },
        dashboardConfiguration,
        anchor: 'bottom-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 2,
          width: 2,
        },
      ],
    });
  });

  it('shrinks single widget to half the size', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -10, y: -10 },
        dashboardConfiguration,
        anchor: 'bottom-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 1,
          width: 1,
        },
      ],
    });
  });

  it('shrinks single widget to a dot', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    expect(
      resize({
        widgetIds: ['some-id'],
        cellSize: 10,
        changeInPosition: { x: -20, y: -20 },
        dashboardConfiguration,
        anchor: 'bottom-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        {
          ...lineChartWidget,
          x: 1,
          y: 1,
          height: 0,
          width: 0,
        },
      ],
    });
  });

  it('stretches two identical squares by a factor of two ', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      id: 'sqr-1',
    });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 1,
      width: 1,
      id: 'sqr-2',
    });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    expect(
      resize({
        widgetIds: ['sqr-1', 'sqr-2'],
        cellSize: 10,
        changeInPosition: { x: 20, y: 20 },
        dashboardConfiguration,
        anchor: 'bottom-right',
      })
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        { ...WIDGET_A, x: 1, y: 1, height: 2, width: 2 },
        { ...WIDGET_B, x: 3, y: 3, height: 2, width: 2 },
      ],
    });
  });
});
