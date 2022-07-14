import { XAnnotation } from '@synchro-charts/core';
import { DashboardConfiguration } from '../types';

export const addXAnnotation = ({
  dashboardConfiguration,
  widgetId,
  annotation,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetId: string;
  annotation: XAnnotation;
}) => {
  return dashboardConfiguration.map((widget) => {
    if (widget.id == widgetId) {
      let currAnnotations = widget.annotations;
      if (currAnnotations && currAnnotations.x) {
        currAnnotations.x.push(annotation);
      } else if (!currAnnotations) {
        currAnnotations = {
          x: [annotation],
        };
      } else {
        currAnnotations = {
          ...currAnnotations,
          x: [annotation],
        };
      }
      return {
        ...widget,
        annotations: currAnnotations,
      };
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
  return dashboardConfiguration.map((widget) => {
    if (widget.id == widgetId) {
      let currAnnotations = widget.annotations;
      if (currAnnotations && currAnnotations.x) {
        currAnnotations = {
          ...currAnnotations,
          x: currAnnotations.x.filter((annotation) => annotation.id != annotationIdToDelete),
        };
      }
      return {
        ...widget,
        annotations: currAnnotations,
      };
    }
    return widget;
  });
};

export const editXAnnotation = ({
  dashboardConfiguration,
  widgetId,
  oldAnnotationId,
  newAnnotation,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetId: string;
  oldAnnotationId: string;
  newAnnotation: XAnnotation;
}) => {
  return dashboardConfiguration.map((widget) => {
    if (widget.id == widgetId) {
      let currAnnotations = widget.annotations;
      if (currAnnotations && currAnnotations.x) {
        currAnnotations.x = currAnnotations.x.filter((annotation) => annotation.id != oldAnnotationId);
        currAnnotations.x.push(newAnnotation);
      }
      return {
        ...widget,
        annotations: currAnnotations,
      };
    }
    return widget;
  });
};
