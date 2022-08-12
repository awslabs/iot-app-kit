import { XAnnotation } from '@synchro-charts/core';
import { DashboardConfiguration } from '../../types';

export const addXAnnotation = ({
  dashboardConfiguration,
  widgetId,
  annotation,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetId: string;
  annotation: XAnnotation;
}) => {
  return dashboardConfiguration.widgets.map((widget) => {
    if (widget.id === widgetId) {
      const currAnnotations = widget.annotations || {};
      const currXAnnotations = currAnnotations.x || [];
      return { ...widget, annotations: { ...currAnnotations, x: [...currXAnnotations, annotation] } };
    }
    return widget;
  });
};

export const deleteXAnnotation = ({
  dashboardConfiguration,
  widgetId,
  annotationIdToDelete,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetId: string;
  annotationIdToDelete: string;
}) => {
  return dashboardConfiguration.widgets.map((widget) => {
    if (widget.id !== widgetId) {
      return widget;
    }
    if (widget.annotations && widget.annotations.x) {
      widget.annotations = {
        ...widget.annotations,
        x: widget.annotations.x.filter((annotation) => annotation.id != annotationIdToDelete),
      };
    }
    return {
      ...widget,
      annotations: widget.annotations,
    };
  });
};

export const editXAnnotation = ({
  dashboardConfiguration,
  widgetId,
  newAnnotation,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetId: string;
  newAnnotation: XAnnotation;
}) => {
  return dashboardConfiguration.widgets.map((widget) => {
    if (widget.id !== widgetId) {
      return widget;
    }
    if (widget.annotations && widget.annotations.x) {
      widget.annotations.x = widget.annotations.x.filter((annotation) => annotation.id != newAnnotation.id);
      widget.annotations = { ...widget.annotations, x: [...widget.annotations.x, newAnnotation] };
    }
    return {
      ...widget,
      annotations: widget.annotations,
    };
  });
};
