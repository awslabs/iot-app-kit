import { MOCK_KPI_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import { onResizeWidgetsAction, resizeWidgets } from './index';

import type { DashboardState } from '../../state';
import { initialState } from '../../state';
import type { DashboardWidget } from '~/types';

const setupDashboardState = (widgets: DashboardWidget[] = []): DashboardState => ({
  ...initialState,
  grid: {
    ...initialState.grid,
    width: 100,
    height: 100,
  },
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
});

it('does nothing if no widgets are provided', () => {
  expect(
    resizeWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onResizeWidgetsAction({
        widgets: [],
        vector: { x: 0.1, y: 0 },
        anchor: 'bottom',
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

describe('top-left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'top-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -0.2, y: -0.2 },
          anchor: 'top-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 1.8,
          y: 1.8,
          width: 2.2,
          height: 2.2,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 1, y: 1 },
          anchor: 'top-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 2,
          height: 2,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 10,
      y: 10,
      height: 20,
      width: 20,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 30,
      y: 10,
      height: 20,
      width: 20,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 10, y: 10 },
          anchor: 'top-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 20,
          y: 20,
          width: 15,
          height: 10,
        }),
        expect.objectContaining({
          x: 35,
          y: 20,
          width: 15,
          height: 10,
        }),
      ])
    );
  });
});

describe('top anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'top',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -100.2, y: -0.2 },
          anchor: 'top',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 1.8,
          width: 2,
          height: 2.2,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 210.2, y: 0.2 },
          anchor: 'top',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 2,
          height: 2,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 20,
      y: 20,
      height: 20,
      width: 20,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 40,
      y: 20,
      height: 20,
      width: 20,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 100, y: 1 },
          anchor: 'top',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 20,
          y: 21,
          width: 20,
          height: 19,
        }),
        expect.objectContaining({
          x: 40,
          y: 21,
          width: 20,
          height: 19,
        }),
      ])
    );
  });
});

describe('top-right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'top-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 0.2, y: -0.2 },
          anchor: 'top-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 1.8,
          width: 2.2,
          height: 2.2,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -1, y: 1 },
          anchor: 'top-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 3,
          width: 3,
          height: 3,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 6,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 1, y: 1 },
          anchor: 'top-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 3,
          width: 4.5,
          height: 3,
        }),
        expect.objectContaining({
          x: 6.5,
          y: 3,
          width: 4.5,
          height: 3,
        }),
      ])
    );
  });
});

describe('right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 0.2, y: -110.2 },
          anchor: 'right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 2.2,
          height: 2,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -1, y: 111 },
          anchor: 'right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 3,
          height: 4,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 6,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 1, y: 111 },
          anchor: 'right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 4.5,
          height: 4,
        }),
        expect.objectContaining({
          x: 6.5,
          y: 2,
          width: 4.5,
          height: 4,
        }),
      ])
    );
  });
});

describe('bottom-right anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'bottom-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 0.2, y: 0.2 },
          anchor: 'bottom-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 2.2,
          height: 2.2,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -1, y: -1 },
          anchor: 'bottom-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 3,
          height: 3,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 6,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 1, y: 1 },
          anchor: 'bottom-right',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 4.5,
          height: 5,
        }),
        expect.objectContaining({
          x: 6.5,
          y: 2,
          width: 4.5,
          height: 5,
        }),
      ])
    );
  });
});

describe('bottom anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'bottom',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 110.2, y: 0.2 },
          anchor: 'bottom',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 2,
          height: 2.2,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -111, y: -1 },
          anchor: 'bottom',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 4,
          height: 3,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 6,
      y: 2,
      height: 4,
      width: 4,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 111, y: 1 },
          anchor: 'bottom',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 2,
          y: 2,
          width: 4,
          height: 5,
        }),
        expect.objectContaining({
          x: 6,
          y: 2,
          width: 4,
          height: 5,
        }),
      ])
    );
  });
});

describe('bottom-left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'bottom-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -1, y: 1 },
          anchor: 'bottom-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 1,
          y: 2,
          width: 3,
          height: 3,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 3,
      y: 2,
      height: 3,
      width: 3,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 1, y: -1 },
          anchor: 'bottom-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 4,
          y: 2,
          width: 2,
          height: 2,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 4,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 1, y: 1 },
          anchor: 'bottom-left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 3,
          y: 2,
          width: 1.5,
          height: 3,
        }),
        expect.objectContaining({
          x: 4.5,
          y: 2,
          width: 1.5,
          height: 3,
        }),
      ])
    );
  });
});

describe('left anchor', () => {
  it('does not stretch widget when cursor has not moved from anchor', () => {
    expect(
      resizeWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onResizeWidgetsAction({
          widgets: [MOCK_KPI_WIDGET],
          vector: { x: 0, y: 0 },
          anchor: 'left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('does stretch widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 1,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: -1, y: 1 },
          anchor: 'left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 0,
          y: 2,
          width: 3,
          height: 2,
        }),
      ])
    );
  });

  it('does shrink widget', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 3,
      y: 2,
      height: 3,
      width: 3,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget],
          vector: { x: 1, y: -1 },
          anchor: 'left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 4,
          y: 2,
          width: 2,
          height: 3,
        }),
      ])
    );
  });

  it('does resize multiple widgets', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({
      x: 2,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });
    const lineChartWidget2 = MockWidgetFactory.getLineChartWidget({
      x: 4,
      y: 2,
      height: 2,
      width: 2,
      id: 'some-id',
    });

    expect(
      resizeWidgets(
        setupDashboardState([lineChartWidget, lineChartWidget2]),
        onResizeWidgetsAction({
          widgets: [lineChartWidget, lineChartWidget2],
          vector: { x: 1, y: 1 },
          anchor: 'left',
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 3,
          y: 2,
          width: 1.5,
          height: 2,
        }),
        expect.objectContaining({
          x: 4.5,
          y: 2,
          width: 1.5,
          height: 2,
        }),
      ])
    );
  });
});
