import isEqual from 'lodash/isEqual';
import React from 'react';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import { getSelectionBox } from '~/helpers/getSelectionBox';
import { Just, Maybe, Nothing } from '~/helpers/maybe';
import { trimRectPosition } from '~/helpers/trimRectPosition';
import { useMoveWidgets } from '~/store/dashboard/use-move-widgets';
import { useResizeWidgets } from '~/store/dashboard/use-resize-widgets';
import { useUpdateWidgets } from '~/store/dashboard/use-update-widgets';
import type { DashboardWidget, Rect } from '~/types';

/**
 * Predicate function type for dashboard widgets
 * will make it possible to narrow a list of dashboard widgets
 * to a common dashboard widget type
 */
export type FilterPredicate<W extends DashboardWidget> = (
  w: DashboardWidget
) => w is W;
/**
 * Render function type to be used by the PropertiesSection component
 * The generic will be used in conjunction with a predicate funtion
 * to allow for narrowing a generic list of dashboard widgets to a
 * common type. This will be useful for determining the properties
 * on that widget.
 */
export type RenderSection<W extends DashboardWidget> = (
  selection: NonNullable<ReturnType<typeof useSelection<W>>>
) => React.ReactElement;

type Getter<T, V> = (target: T) => V;
/**
 * set value V in target T and return the updated target
 * which is the same type
 */
type Setter<T, V> = (target: T, value: V) => T;

/**
 * Composition of a getter and setter.
 * W is the target for both getter and setter
 * T is the value type for both getter and setter
 * returns a tuple of the value produced by the getter,
 * and a function which can be called with a new value
 * which will set that value in the target.
 */
type Lens<W> = <T>(
  selector: Getter<W, T>,
  updater: Setter<W, T>
) => [Maybe<T>, (newValue: T) => void];

// Lense specifically for widget properties
export type PropertyLens<W extends DashboardWidget> = Lens<W['properties']>;

const NO_SIZE = { height: 0, width: 0 };
const NO_POSITION = { x: 0, y: 0 };

/**
 *
 * Helper to convert a list of values of 1 type into a Maybe type
 * that represents those a singular value of that list
 *
 * for eg.
 * if all values are the same it results in a Maybe of that value
 * [1, 1, 1, 1,] => Maybe<1>
 *
 * if all alues are NOT the same it results in Nothing
 * [1, 2, 3, 1,] => Nothing
 *
 * This is used to find the value for a property on the composite selection
 *
 * @param values T[]
 * @returns Maybe<T>
 */
const compositeValue = <T>(values: T[]): Maybe<T> =>
  values.every((v) => isEqual(v, values[0])) ? Just(values[0]) : Nothing();

/**
 *
 * the most generic predicate function for a dashboard widget list
 * Is always true. To be used as the default predicate function in useSelection
 */
export const isDashboardWidget = (
  widget: DashboardWidget
): widget is DashboardWidget => !!widget;

/**
 *
 * hook that represents the widget selection
 *
 * returns other hooks to be used in react components
 *
 * returns:
 * useProperty: hook that allows you to get and set a value on the selection
 * useSize: hook that allows you to get and set the size of the selection
 * usePosition: hook that allows you to get and set the position of the selection
 *
 */
export const useSelection = <W extends DashboardWidget>(
  { filter }: { filter?: FilterPredicate<W> } = { filter: undefined }
) => {
  const selectedWidgets = useSelectedWidgets();
  const updateWidgets = useUpdateWidgets();
  const resizeWidgets = useResizeWidgets();
  const moveWidgets = useMoveWidgets();
  const filteredSelection = selectedWidgets.filter(filter ?? isDashboardWidget);

  /**
   * selection filter does not apply to entire selection
   * this means we cannot correctly narrow the selection type
   */
  if (
    selectedWidgets.length === 0 ||
    !isEqual(selectedWidgets, filteredSelection)
  )
    return undefined;

  const selection = filteredSelection;

  /**
   * TECH DEBT: getSelectionBox should never be null given the above check
   */
  const { x, y, height, width } = trimRectPosition(
    getSelectionBox(selection) ?? { ...NO_SIZE, ...NO_POSITION }
  );

  const useSize = (): [
    Pick<Rect, 'height' | 'width'>,
    (vector: Pick<Rect, 'x' | 'y'>) => void
  ] => [
    { height, width },
    (vector) =>
      resizeWidgets({
        anchor: 'bottom-right',
        widgets: selection,
        vector,
      }),
  ];
  const usePosition = (): [
    Pick<Rect, 'x' | 'y'>,
    (vector: Pick<Rect, 'x' | 'y'>) => void
  ] => [
    { x, y },
    (vector) =>
      moveWidgets({
        widgets: selection,
        vector,
        complete: true,
      }),
  ];

  const types = selection.map((w) => w.type);
  const type = compositeValue(types);

  const useProperty: PropertyLens<W> = (selector, updater) => {
    /**
     * the value of the selector is only defined
     * if every widget in the selection has the same value
     * otherwise we can not pick a single value to represent
     * the selection
     */
    const propertyValues = selection.map((widget) =>
      selector(widget.properties)
    );
    const propertyValue = compositeValue(propertyValues);

    return [
      propertyValue,
      (newValue) => {
        const updatedWidgets = selection.map((widget) => ({
          ...widget,
          properties: updater(widget.properties, newValue),
        }));
        updateWidgets(updatedWidgets);
      },
    ];
  };

  return {
    type,
    types,
    useSize,
    usePosition,
    useProperty,
  };
};
