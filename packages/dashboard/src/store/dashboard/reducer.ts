import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import { max, maxBy, minBy, xorBy } from 'lodash';
import type { SetRequired } from 'type-fest';
import { v4 } from 'uuid';
import { WidgetPropertiesGeneratorMap } from '~/customization/widgetPropertiesGeneratorMap';
import type { RefreshRate } from '~/features/refresh-rate/types';
import { constrainWidgetPositionToGrid } from '~/helpers/constrainWidgetPositionToGrid';
import { getSelectionBox } from '~/helpers/getSelectionBox';
import { createNonNullableList } from '~/helpers/lists';
import { moveSelectionBox } from '~/helpers/moveSelectionBox';
import { resizeSelectionBox } from '~/helpers/resizeSelectionBox';
import { transformWidget } from '~/helpers/transformWidget';
import { trimRectPosition } from '~/helpers/trimRectPosition';
import type {
  DashboardConfiguration,
  DashboardWidget,
  Position,
} from '~/types';
export type Anchor =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom';

export interface RuntimeDashboardConfiguration extends DashboardConfiguration {
  querySettings: SetRequired<
    NonNullable<DashboardConfiguration['querySettings']>,
    'refreshRate'
  >;
  displaySettings: SetRequired<
    DashboardConfiguration['displaySettings'],
    'cellSize'
  >;
}

export interface DashboardState {
  copiedWidgetIds: string[];
  pasteCounter: number;
  dashboardConfiguration: RuntimeDashboardConfiguration;
  isCanvasEnabled: boolean;
}

export const initialState: DashboardState = {
  copiedWidgetIds: [],
  pasteCounter: 0,
  dashboardConfiguration: {
    widgets: [],
    displaySettings: {
      numColumns: 100,
      numRows: 100,
      cellSize: 20,
      significantDigits: 4,
    },
    querySettings: {
      refreshRate: 5000,
    },
  },
  isCanvasEnabled: true,
};

export const dashboardConfigurationSlice = createSlice({
  name: 'dashboardConfiguration',
  initialState,

  reducers: {
    updateHeight: (state, action: PayloadAction<number>) => {
      state.dashboardConfiguration.displaySettings.numRows = action.payload;
    },

    updateWidth: (state, action: PayloadAction<number>) => {
      state.dashboardConfiguration.displaySettings.numColumns = action.payload;
    },

    updateCellSize: (state, action: PayloadAction<number>) => {
      state.dashboardConfiguration.displaySettings.cellSize = action.payload;
    },

    updateDecimalPlaces: (state, action: PayloadAction<number>) => {
      state.dashboardConfiguration.displaySettings.significantDigits =
        action.payload;
    },

    updateDefaultViewport: (
      state,
      action: PayloadAction<DashboardConfiguration['defaultViewport']>
    ) => {
      state.dashboardConfiguration.defaultViewport = action.payload;
    },

    updateRefreshRate: (state, action: PayloadAction<RefreshRate>) => {
      if (!state.dashboardConfiguration.querySettings) {
        state.dashboardConfiguration.querySettings = {
          refreshRate: action.payload,
        };
      } else {
        state.dashboardConfiguration.querySettings.refreshRate = action.payload;
      }
    },

    createWidgets: (
      state,
      action: PayloadAction<{ type: string; x?: number; y?: number }[]>
    ) => {
      const { cellSize, numRows, numColumns } =
        state.dashboardConfiguration.displaySettings;

      const newWidgets = action.payload
        .map(({ type, x = 0, y = 0 }) => {
          const { properties, initialSize } =
            WidgetPropertiesGeneratorMap[type];

          const { width: widgetPixelWidth, height: widgetPixelHeight } =
            initialSize || { height: 150, width: 150 };

          return {
            id: nanoid(),
            type,
            width: Math.min(Math.ceil(widgetPixelWidth / cellSize), numColumns),
            height: Math.min(Math.ceil(widgetPixelHeight / cellSize), numRows),
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
    },

    updateWidgets: (state, action: PayloadAction<DashboardWidget[]>) => {
      const widgets = action.payload
        .map((w) =>
          constrainWidgetPositionToGrid(
            {
              x: 0,
              y: 0,
              width: state.dashboardConfiguration.displaySettings.numColumns,
              height: state.dashboardConfiguration.displaySettings.numRows,
            },
            w
          )
        )
        .map(trimRectPosition);

      const updatedWidgets = state.dashboardConfiguration.widgets.map((w) => {
        return widgets.find((k) => k.id === w.id) || w;
      });

      state.dashboardConfiguration.widgets = updatedWidgets;
    },

    deleteWidgets: (state, action: PayloadAction<{ widgetIds: string[] }>) => {
      const remainingWidgets = state.dashboardConfiguration.widgets.filter(
        ({ id }) => !action.payload.widgetIds.includes(id)
      );

      state.dashboardConfiguration.widgets = remainingWidgets;
    },

    copyWidgets: (
      state,
      { payload: { widgetIds } }: PayloadAction<{ widgetIds: string[] }>
    ) => {
      state.copiedWidgetIds = widgetIds;
    },

    pasteWidgets: (
      state,
      {
        payload: { position, widgetIds },
      }: PayloadAction<{ position?: Position | undefined; widgetIds: string[] }>
    ) => {
      const cellSize = state.dashboardConfiguration.displaySettings.cellSize;
      const copyGroup = getWidgetsFromIds({
        widgetIds,
        widgets: state.dashboardConfiguration.widgets,
      });
      const gridWidth = state.dashboardConfiguration.displaySettings.numColumns;
      const gridHeight = state.dashboardConfiguration.displaySettings.numRows;

      let offset: Position = {
        x: 0,
        y: 0,
      };
      const correctionOffset: Position = {
        x: 0,
        y: 0,
      };
      if (position !== undefined) {
        state.pasteCounter = 0;

        const cellPosition: Position = {
          x: position && Math.floor(position.x / cellSize),
          y: position && Math.floor(position.y / cellSize),
        };

        // getting widgets group's left most cell value
        const leftmostWidget: DashboardWidget =
          minBy(copyGroup, 'x') || copyGroup[0];
        const groupLeftX = leftmostWidget.x;

        // getting widgets group's top most cell value
        const topmostWidget: DashboardWidget =
          minBy(copyGroup, 'y') || copyGroup[0];
        const groupTopY = topmostWidget.y;

        // getting widgets group's right most cell value
        const widgetsRightPos = copyGroup.map((widget) => {
          return widget.x + widget.width;
        });
        const groupRightX = max(widgetsRightPos) || gridWidth;

        // getting widgets group's bottom most cell value
        const widgetsBottomPos = copyGroup.map((widget) => {
          return widget.y + widget.height;
        });
        const groupBottomY = max(widgetsBottomPos) || gridHeight;

        // calculating widgets group's width & height
        const groupWidth = groupRightX - groupLeftX;
        const groupHeight = groupBottomY - groupTopY;

        // setting offset postion
        offset = {
          x: cellPosition.x - groupLeftX,
          y: cellPosition.y - groupTopY,
        };

        // setting correction offset position if widgets group's width or height is going off the grid
        if (cellPosition.x + groupWidth > gridWidth) {
          correctionOffset.x = cellPosition.x + groupWidth - gridWidth;
        }
        if (cellPosition.y + groupHeight > gridHeight) {
          correctionOffset.y = cellPosition.y + groupHeight - gridHeight;
        }
      }

      const widgetsToPaste = copyGroup.map((widget) => ({
        ...widget,
        id: v4(),
        x: offset.x + widget.x + state.pasteCounter - correctionOffset.x,
        y: offset.y + widget.y + state.pasteCounter - correctionOffset.y,
      }));

      state.dashboardConfiguration.widgets.push(...widgetsToPaste);
      state.pasteCounter = position ? 0 : state.pasteCounter;
      // state.selectedWidgetIds = widgetsToPaste.map(({ id }) => id);
    },

    bringWidgetsToFront: (
      state,
      { payload: { widgetIds } }: PayloadAction<{ widgetIds: string[] }>
    ) => {
      // We don't need to do anything if all widgets are selected
      if (widgetIds.length === state.dashboardConfiguration.widgets.length) {
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
    },

    sendWidgetsToBack: (
      state,
      { payload: { widgetIds } }: PayloadAction<{ widgetIds: string[] }>
    ) => {
      // We don't need to do anything if all widgets are selected
      if (widgetIds.length === state.dashboardConfiguration.widgets.length) {
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
    },

    resizeWidgets: (
      state,
      action: PayloadAction<{
        anchor: Anchor;
        widgets: DashboardWidget[];
        vector: Position;
        complete?: boolean;
      }>
    ) => {
      const { anchor, widgets, vector, complete } = action.payload;

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
    },

    moveWidgets: (
      state,
      action: PayloadAction<{
        widgets: DashboardWidget[];
        vector: Position;
        complete?: boolean;
      }>
    ) => {
      const { vector, complete, widgets } = action.payload;
      const selectedWidgetIds = action.payload.widgets.map((w) => w.id);
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
    },

    disableCanvas: (state) => {
      state.isCanvasEnabled = false;
    },

    enableCanvas: (state) => {
      state.isCanvasEnabled = true;
    },
  },
});

export const {
  createWidgets,
  deleteWidgets,
  bringWidgetsToFront,
  sendWidgetsToBack,
  moveWidgets,
  pasteWidgets,
  copyWidgets,
  resizeWidgets,
  updateCellSize,
  updateDecimalPlaces,
  updateDefaultViewport,
  updateRefreshRate,
  updateWidgets,
  updateHeight,
  updateWidth,
  disableCanvas,
  enableCanvas,
} = dashboardConfigurationSlice.actions;

export const dashboardConfigurationReducer =
  dashboardConfigurationSlice.reducer;

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
