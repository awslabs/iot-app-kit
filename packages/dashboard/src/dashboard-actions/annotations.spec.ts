import { addXAnnotation, deleteXAnnotation, editXAnnotation } from './annotations';
import { Widget } from '../types';
import { Annotations, XAnnotation } from '@synchro-charts/core';

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

const ANNOTATIONS: Annotations = {
  x: [XANNOTATION_1],
};

const ANNOTATIONS_2: Annotations = {
  x: [XANNOTATION_2],
};

const WIDGET_WITH_FIRST_ANNOTATION: Widget = {
  width: 10,
  height: 10,
  x: 10,
  y: 10,
  z: 10,
  widget: 'line-chart',
  id: 'widget-with-first-annotation',
  annotations: ANNOTATIONS,
};

const WIDGET_WITHOUT_ANNOTATIONS: Widget = {
  width: 10,
  height: 10,
  x: 10,
  y: 10,
  z: 10,
  widget: 'line-chart',
  id: 'widget-without-annotations',
};

describe('addXAnnotation', () => {
  it('adds annotation when adding to a widget with no annotations prop', () => {
    const INPUT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-without-annotations',
    };
    const RESULT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-without-annotations',
      annotations: {
        x: [XANNOTATION_1],
      },
    };
    expect(
      addXAnnotation({
        dashboardConfiguration: [INPUT_WIDGET],
        widgetId: 'widget-without-annotations',
        annotation: XANNOTATION_1,
      })
    ).toEqual([RESULT_WIDGET]);
  });

  it('adds annotation when adding to a widget with an empty annotations prop', () => {
    var INPUT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-empty-annotations',
      annotations: {
        x: [],
      },
    };
    const RESULT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-empty-annotations',
      annotations: {
        x: [XANNOTATION_1],
      },
    };
    expect(
      addXAnnotation({
        dashboardConfiguration: [INPUT_WIDGET],
        widgetId: 'widget-with-empty-annotations',
        annotation: XANNOTATION_1,
      })
    ).toEqual([RESULT_WIDGET]);
  });

  it('adds annotation when adding to a widget with existing annotations', () => {
    const INPUT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-first-annotation',
      annotations: {
        x: [XANNOTATION_1],
      },
    };
    const RESULT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-first-annotation',
      annotations: {
        x: [XANNOTATION_1, XANNOTATION_2],
      },
    };
    expect(
      addXAnnotation({
        dashboardConfiguration: [INPUT_WIDGET],
        widgetId: 'widget-with-first-annotation',
        annotation: XANNOTATION_2,
      })
    ).toEqual([RESULT_WIDGET]);
  });

  it('does not add annotation when provided non-existent widgetId', () => {
    expect(
      addXAnnotation({
        dashboardConfiguration: [WIDGET_WITH_FIRST_ANNOTATION],
        widgetId: 'non-existent-widget',
        annotation: XANNOTATION_1,
      })
    ).toEqual([WIDGET_WITH_FIRST_ANNOTATION]);
  });
});

describe('deleteXAnnotation', () => {
  it('deletes annotation from a widget with one annotation', () => {
    const INPUT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-first-annotation',
      annotations: {
        x: [XANNOTATION_1],
      },
    };
    const RESULT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-first-annotation',
      annotations: {
        x: [],
      },
    };
    expect(
      deleteXAnnotation({
        dashboardConfiguration: [INPUT_WIDGET],
        widgetId: 'widget-with-first-annotation',
        annotationIdToDelete: '1',
      })
    ).toEqual([RESULT_WIDGET]);
  });

  it('deletes annotation from a widget with multiple annotations', () => {
    const INPUT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-both-annotations',
      annotations: {
        x: [XANNOTATION_1, XANNOTATION_2],
      },
    };
    const RESULT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-both-annotations',
      annotations: {
        x: [XANNOTATION_1],
      },
    };
    expect(
      deleteXAnnotation({
        dashboardConfiguration: [INPUT_WIDGET],
        widgetId: 'widget-with-both-annotations',
        annotationIdToDelete: '2',
      })
    ).toEqual([RESULT_WIDGET]);
  });

  it('does not delete an annotation if it does not exist on a widget', () => {
    expect(
      deleteXAnnotation({
        dashboardConfiguration: [WIDGET_WITH_FIRST_ANNOTATION],
        widgetId: 'widget-with-first-annotation',
        annotationIdToDelete: '2',
      })
    ).toEqual([WIDGET_WITH_FIRST_ANNOTATION]);
  });

  it('does not delete an annotation when provided non-existent widgetId', () => {
    expect(
      deleteXAnnotation({
        dashboardConfiguration: [WIDGET_WITH_FIRST_ANNOTATION],
        widgetId: 'non-existent-widget',
        annotationIdToDelete: '1',
      })
    ).toEqual([WIDGET_WITH_FIRST_ANNOTATION]);
  });
});

describe('editXAnnotation', () => {
  it('does not edit annotation from a widget with no annotations', () => {
    expect(
      editXAnnotation({
        dashboardConfiguration: [WIDGET_WITHOUT_ANNOTATIONS],
        widgetId: 'widget-without-annotations',
        oldAnnotationId: '1',
        newAnnotation: XANNOTATION_2,
      })
    ).toEqual([WIDGET_WITHOUT_ANNOTATIONS]);
  });

  it('edits an annotation on a widget with one annotation', () => {
    const INPUT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-first-annotation',
      annotations: {
        x: [XANNOTATION_1],
      },
    };
    const RESULT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-first-annotation',
      annotations: ANNOTATIONS_2,
    };
    expect(
      editXAnnotation({
        dashboardConfiguration: [INPUT_WIDGET],
        widgetId: 'widget-with-first-annotation',
        oldAnnotationId: '1',
        newAnnotation: XANNOTATION_2,
      })
    ).toEqual([RESULT_WIDGET]);
  });

  it('edits an annotation on a widget with multiple annotations', () => {
    const INPUT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-both-annotations',
      annotations: {
        x: [XANNOTATION_1, XANNOTATION_2],
      },
    };
    const RESULT_WIDGET = {
      width: 10,
      height: 10,
      x: 10,
      y: 10,
      z: 10,
      widget: 'line-chart',
      id: 'widget-with-both-annotations',
      annotations: {
        x: [XANNOTATION_1, XANNOTATION_3],
      },
    };
    expect(
      editXAnnotation({
        dashboardConfiguration: [INPUT_WIDGET],
        widgetId: 'widget-with-both-annotations',
        oldAnnotationId: '2',
        newAnnotation: XANNOTATION_3,
      })
    ).toEqual([RESULT_WIDGET]);
  });
});
