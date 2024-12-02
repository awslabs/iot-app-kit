import { createNonNullableList } from '@iot-app-kit/helpers/lists/createNonNullableList';
import debounce from 'lodash-es/debounce';
import maxBy from 'lodash-es/maxBy';
import minBy from 'lodash-es/minBy';
import xorBy from 'lodash-es/xorBy';
import { nanoid } from 'nanoid';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { WidgetPropertiesGeneratorMap } from '../../customization/widgetPropertiesGeneratorMap';
import { Anchor } from '../../store/actions';
import type {
  DashboardConfiguration,
  DashboardWidget,
  Position,
} from '../../types';
import { constrainWidgetPositionToGrid } from '../../util/constrainWidgetPositionToGrid';
import { getSelectionBox } from '../../util/getSelectionBox';
import { moveSelectionBox } from '../../util/moveSelectionBox';
import { resizeSelectionBox } from '../../util/resizeSelectionBox';
import { transformWidget } from '../../util/transformWidget';
import { trimRectPosition } from '../../util/trimRectPosition';

function getWidgetsFromIds({
  widgets,
  widgetIds,
}: {
  widgets: DashboardWidget[];
  widgetIds: string[];
}): DashboardWidget[] {
  return createNonNullableList(
    widgetIds.map((id) => widgets.find((widget) => widget.id === id))
  );
}

export interface DashboardConfigurationState {
  dashboardConfiguration: DashboardConfiguration;
}

export type UpdateHeight = (params: { height: number }) => void;
export type UpdateWidth = (params: { width: number }) => void;
export type UpdateCellSize = (params: { cellSize: number }) => void;
export type UpdateDecimalPlaces = (params: { decimalPlaces: number }) => void;
export type UpdateDefaultViewport = (params: {
  defaultViewport: NonNullable<DashboardConfiguration['defaultViewport']>;
}) => void;
export type UpdateRefreshRate = (params: {
  refreshRate: NonNullable<
    NonNullable<DashboardConfiguration['querySettings']>['refreshRate']
  >;
}) => void;

export type CreateWidgets = (params: {
  widgets: { type: string; x?: number; y?: number }[];
}) => void;
export type UpdateWidgets = (params: { widgets: DashboardWidget[] }) => void;
export type DeleteWidgets = (params: { widgetIds: string[] }) => void;
export type BringWidgetsToFront = (params: { widgetIds: string[] }) => void;
export type SendWidgetsToBack = (params: { widgetIds: string[] }) => void;
export type ResizeWidgets = (params: {
  anchor: Anchor;
  widgets: DashboardWidget[];
  vector: Position;
  complete?: boolean;
}) => void;
export type MoveWidgets = (params: {
  widgets: DashboardWidget[];
  vector: Position;
  complete?: boolean;
}) => void;

export interface DashboardConfigurationActions {
  updateHeight: UpdateHeight;
  updateWidth: UpdateWidth;
  updateCellSize: UpdateCellSize;
  updateDecimalPlaces: UpdateDecimalPlaces;
  updateDefaultViewport: UpdateDefaultViewport;
  updateRefreshRate: UpdateRefreshRate;
  createWidgets: CreateWidgets;
  updateWidgets: UpdateWidgets;
  deleteWidgets: DeleteWidgets;
  bringWidgetsToFront: BringWidgetsToFront;
  sendWidgetsToBack: SendWidgetsToBack;
  resizeWidgets: ResizeWidgets;
  moveWidgets: MoveWidgets;
}

const DEFAULT_HEIGHT_IN_CELLS = 100;
const DEFAULT_WIDTH_IN_CELLS = 100;
const DEFAULT_CELL_SIZE_IN_PX = 20;
const DEFAULT_NUM_OF_DECIMAL_PLACES = 4;

export const useDashboardConfiguration = create<
  DashboardConfigurationState & DashboardConfigurationActions
>()(
  temporal(
    immer((set) => ({
      dashboardConfiguration: {
        widgets: [],
        displaySettings: {
          numRows: DEFAULT_HEIGHT_IN_CELLS,
          numColumns: DEFAULT_WIDTH_IN_CELLS,
        },
      },

      updateHeight: ({ height }) => {
        set((state) => {
          state.dashboardConfiguration.displaySettings.numRows = height;
        });
      },

      updateWidth: ({ width }) => {
        set((state) => {
          state.dashboardConfiguration.displaySettings.numColumns = width;
        });
      },

      updateCellSize: ({ cellSize }) => {
        set((state) => {
          state.dashboardConfiguration.displaySettings.cellSize = cellSize;
        });
      },

      updateDecimalPlaces: ({ decimalPlaces }) => {
        set((state) => {
          state.dashboardConfiguration.displaySettings.significantDigits =
            decimalPlaces;
        });
      },

      updateDefaultViewport: ({ defaultViewport }) => {
        set((state) => {
          state.dashboardConfiguration.defaultViewport = defaultViewport;
        });
      },

      updateRefreshRate: ({ refreshRate }) => {
        set((state) => {
          if (state.dashboardConfiguration.querySettings) {
            state.dashboardConfiguration.querySettings.refreshRate =
              refreshRate;
          } else {
            state.dashboardConfiguration.querySettings = { refreshRate };
          }
        });
      },

      createWidgets: ({ widgets }) => {
        set((state) => {
          const {
            cellSize = DEFAULT_CELL_SIZE_IN_PX,
            numRows,
            numColumns,
          } = state.dashboardConfiguration.displaySettings;
          const newWidgets = widgets
            .map(({ type, x = 0, y = 0 }) => {
              const { properties, initialSize } =
                WidgetPropertiesGeneratorMap[type];

              const { width: widgetPixelWidth, height: widgetPixelHeight } =
                initialSize || { height: 150, width: 150 };

              return {
                id: nanoid(),
                type,
                width: Math.min(
                  Math.ceil(widgetPixelWidth / cellSize),
                  numColumns
                ),
                height: Math.min(
                  Math.ceil(widgetPixelHeight / cellSize),
                  numRows
                ),
                x,
                y,
                z: 0,
                properties: (properties && properties()) || {},
              };
            })
            .map((widget) => {
              return constrainWidgetPositionToGrid(
                {
                  x: 0,
                  y: 0,
                  width: numColumns,
                  height: numRows,
                },
                widget
              );
            })
            .map(trimRectPosition);

          state.dashboardConfiguration.widgets.push(...newWidgets);
        });
      },

      updateWidgets: ({ widgets }) => {
        set((state) => {
          const widgetsToUpdate = widgets
            .map((w) =>
              constrainWidgetPositionToGrid(
                {
                  x: 0,
                  y: 0,
                  width:
                    state.dashboardConfiguration.displaySettings.numColumns,
                  height: state.dashboardConfiguration.displaySettings.numRows,
                },
                w
              )
            )
            .map(trimRectPosition);

          const updatedWidgets = state.dashboardConfiguration.widgets.map(
            (w) => {
              return widgetsToUpdate.find((k) => k.id === w.id) || w;
            }
          );

          state.dashboardConfiguration.widgets = updatedWidgets;
        });
      },

      deleteWidgets: ({ widgetIds }) => {
        set((state) => {
          const remainingWidgets = state.dashboardConfiguration.widgets.filter(
            ({ id }) => !widgetIds.includes(id)
          );

          state.dashboardConfiguration.widgets = remainingWidgets;
        });
      },

      bringWidgetsToFront: ({ widgetIds }) => {
        set((state) => {
          // We don't need to do anything if all widgets are selected
          if (
            widgetIds.length === state.dashboardConfiguration.widgets.length
          ) {
            return state;
          }

          const widgetsToUpdate = getWidgetsFromIds({
            widgetIds,
            widgets: state.dashboardConfiguration.widgets,
          });

          const unselectedWidgets = xorBy(
            state.dashboardConfiguration.widgets,
            widgetsToUpdate,
            'id'
          );

          const topZIndex = maxBy(unselectedWidgets, 'z')?.z ?? 0;
          const minSelectedZ = minBy(widgetsToUpdate, 'z')?.z ?? 0;

          const zOffset = topZIndex + 1 - minSelectedZ;

          const translatedWidgets = state.dashboardConfiguration.widgets.map(
            (widget) => ({
              ...widget,
              z: widgetIds.includes(widget.id) ? widget.z + zOffset : widget.z,
            })
          );

          state.dashboardConfiguration.widgets = translatedWidgets;
        });
      },

      sendWidgetsToBack: ({ widgetIds }) => {
        set((state) => {
          // We don't need to do anything if all widgets are selected
          if (
            widgetIds.length === state.dashboardConfiguration.widgets.length
          ) {
            return state;
          }

          const widgetsToUpdate = getWidgetsFromIds({
            widgetIds,
            widgets: state.dashboardConfiguration.widgets,
          });

          const unselectedWidgets = xorBy(
            state.dashboardConfiguration.widgets,
            widgetsToUpdate,
            'id'
          );

          const bottomZIndex = minBy(unselectedWidgets, 'z')?.z ?? 0;
          const maxSelectedZ = maxBy(widgetsToUpdate, 'z')?.z ?? 0;

          const zOffset = bottomZIndex - 1 - maxSelectedZ;

          const translatedWidgets = state.dashboardConfiguration.widgets.map(
            (widget) => ({
              ...widget,
              z: widgetIds.includes(widget.id) ? widget.z + zOffset : widget.z,
            })
          );

          state.dashboardConfiguration.widgets = translatedWidgets;
        });
      },

      resizeWidgets: ({ anchor, vector, widgets, complete }) => {
        set((state) => {
          const selectedWidgetIds = widgets.map((w) => w.id);

          const selectionBox = getSelectionBox(widgets);

          if (!selectionBox) return state;

          const newSelectionBox = resizeSelectionBox({
            selectionBox,
            anchor,
            vector,
            grid: {
              height: state.dashboardConfiguration.displaySettings.numRows,
              width: state.dashboardConfiguration.displaySettings.numColumns,
            },
          });

          const resizer = (widget: DashboardWidget) =>
            transformWidget(
              widget,
              selectionBox,
              complete ? trimRectPosition(newSelectionBox) : newSelectionBox
            );

          const updateWidgets = (widgets: DashboardWidget[]) =>
            widgets.map((widget) => {
              if (!selectedWidgetIds.includes(widget.id)) return widget;
              return resizer(widget);
            });

          state.dashboardConfiguration.widgets = updateWidgets(
            state.dashboardConfiguration.widgets
          );
        });
      },

      moveWidgets: ({ vector, complete, widgets }) => {
        set((state) => {
          const selectedWidgetIds = widgets.map((w) => w.id);
          const selectionBox = getSelectionBox(widgets);
          if (!selectionBox) return state;

          const newSelectionBox = moveSelectionBox({
            selectionBox,
            vector,
            grid: {
              height: state.dashboardConfiguration.displaySettings.numRows,
              width: state.dashboardConfiguration.displaySettings.numColumns,
            },
          });

          const mover = (widget: DashboardWidget) =>
            transformWidget(
              widget,
              selectionBox,
              complete ? trimRectPosition(newSelectionBox) : newSelectionBox
            );

          const updateWidgets = (widgets: DashboardWidget[]) =>
            widgets.map((widget) => {
              if (!selectedWidgetIds.includes(widget.id)) return widget;
              return mover(widget);
            });

          state.dashboardConfiguration.widgets = updateWidgets(
            state.dashboardConfiguration.widgets
          );
        });
      },
    })),
    {
      handleSet: (handleSet) => {
        return debounce<typeof handleSet>((state) => {
          console.log(state);
          handleSet(state);
        }, 100);
      },
    }
  )
);

export function useUndoRedo() {
  const { undo, redo, clear } = useDashboardConfiguration.temporal.getState();

  return { undo, redo, clear };
}
