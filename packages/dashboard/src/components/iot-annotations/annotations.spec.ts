import { addXAnnotation, deleteXAnnotation, editXAnnotation } from './annotations';
import { MockWidgetFactory } from '../../testing/mocks';
import { XAnnotation } from '@synchro-charts/core';

const XANNOTATION_1: XAnnotation = {
  color: 'red',
  value: new Date(2000, 1, 0),
  id: '1',
};

const XANNOTATION_2: XAnnotation = {
  color: 'red',
  value: new Date(2000, 3, 15),
  id: '2',
};

const XANNOTATION_3: XAnnotation = {
  color: 'red',
  value: new Date(2000, 7, 19),
  id: '3',
};

const UNTOUCHED_WIDGET = MockWidgetFactory.getScatterChartWidget({
  id: 'widget-2',
});

describe('addXAnnotation', () => {
  it('adds annotation when adding to a widget with no annotations prop', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
    });
    const RESULT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    expect(
      addXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        annotation: XANNOTATION_1,
      })
    ).toEqual([RESULT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('adds annotation when adding to a widget with an empty annotations prop', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [],
      },
    });
    const RESULT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    expect(
      addXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        annotation: XANNOTATION_1,
      })
    ).toEqual([RESULT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('adds annotation when adding to a widget with existing annotations', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    const RESULT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1, XANNOTATION_2],
      },
    });
    expect(
      addXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        annotation: XANNOTATION_2,
      })
    ).toEqual([RESULT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('does not add annotation when provided non-existent widgetId', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    expect(
      addXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'non-existent-id',
        annotation: XANNOTATION_2,
      })
    ).toEqual([INPUT_WIDGET, UNTOUCHED_WIDGET]);
  });
});

describe('deleteXAnnotation', () => {
  it('deletes annotation from a widget with one annotation', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    const RESULT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [],
      },
    });
    expect(
      deleteXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        annotationIdToDelete: '1',
      })
    ).toEqual([RESULT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('deletes annotation from a widget with multiple annotations', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1, XANNOTATION_2],
      },
    });
    const RESULT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    expect(
      deleteXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        annotationIdToDelete: '2',
      })
    ).toEqual([RESULT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('does not delete an annotation if it does not exist on a widget', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    expect(
      deleteXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        annotationIdToDelete: '2',
      })
    ).toEqual([INPUT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('does not delete an annotation when provided non-existent widgetId', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    expect(
      deleteXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'non-existent-widget',
        annotationIdToDelete: '1',
      })
    ).toEqual([INPUT_WIDGET, UNTOUCHED_WIDGET]);
  });
});

describe('editXAnnotation', () => {
  it('does not edit annotation from a widget with no annotations', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
    });
    expect(
      editXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        newAnnotation: XANNOTATION_2,
      })
    ).toEqual([INPUT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('edits an annotation on a widget with one annotation', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1],
      },
    });
    const RESULT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [{ ...XANNOTATION_2, id: '1' }],
      },
    });
    expect(
      editXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        newAnnotation: { ...XANNOTATION_2, id: '1' },
      })
    ).toEqual([RESULT_WIDGET, UNTOUCHED_WIDGET]);
  });

  it('edits an annotation on a widget with multiple annotations', () => {
    const INPUT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1, XANNOTATION_2],
      },
    });
    const RESULT_WIDGET = MockWidgetFactory.getScatterChartWidget({
      id: 'widget-1',
      annotations: {
        x: [XANNOTATION_1, { ...XANNOTATION_3, id: '2' }],
      },
    });
    expect(
      editXAnnotation({
        dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [INPUT_WIDGET, UNTOUCHED_WIDGET] },
        widgetId: 'widget-1',
        newAnnotation: { ...XANNOTATION_3, id: '2' },
      })
    ).toEqual([RESULT_WIDGET, UNTOUCHED_WIDGET]);
  });
});
