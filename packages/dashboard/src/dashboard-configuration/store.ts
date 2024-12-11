import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import max from 'lodash-es/max';
import unionBy from 'lodash-es/unionBy';
import maxBy from 'lodash-es/maxBy';
import minBy from 'lodash-es/minBy';
import xorBy from 'lodash-es/xorBy';
import { v4 } from 'uuid';
import { WidgetPropertiesGeneratorMap } from '#customization/widgetPropertiesGeneratorMap';
import type { RefreshRate } from '#components/refreshRate/types';
import { placeWithinRectangle } from '#grid/rectangle/nest';
import { resizeSelectionBox } from '~/features/widgetResize/resizeSelectionBox';
import { transformWidget } from '~/features/widgetResize/transformWidget';
import { getSelectionBox } from '~/features/widgetSelection/getSelectionBox';
import { moveSelectionBox } from '~/features/widgetSelection/moveSelectionBox';
import { compact } from '@iot-app-kit/helpers';
import type {
  DashboardConfiguration,
  DashboardDisplaySettings,
  DashboardWidget,
} from '#types';
import { createRectangle } from '#grid/rectangle/create';
import type { Anchor } from '#grid/rectangle/types';
import { placeWithinGrid } from '#grid/contain';
import { createGrid } from '#grid/create';
import type { Grid } from '#grid/types';
import { evolve } from '@iot-app-kit/helpers/lists/evolve';
import Widgets from '#components/widgets/list';
import { map } from '@iot-app-kit/helpers/lists/map';
import { LastArrayElement, RequiredKeysOf } from 'type-fest';
import type { Position } from '#grid/position/types';
import { DashboardWidgetType } from '#migration/types';
import invariant from 'tiny-invariant';
import type { F } from 'ts-toolbelt';

declare const pipe: F.Pipe;

export interface DashboardState {
  copiedWidgetIds: string[];
  pasteCounter: number;
  dashboardConfiguration: DashboardConfiguration;
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

export const {
  reducer,
  actions: {
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
    replaceDashboardConfiguration,
  },
} = createSlice({
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
      {
        payload,
      }: PayloadAction<{
        widgets: (Position & { type: DashboardWidgetType })[];
      }>
    ) => {
      const {
        cellSize = 20,
        numRows,
        numColumns,
      } = state.dashboardConfiguration.displaySettings;

      const newWidgetsNew = pipe(
        map((widget: Position & { type: DashboardWidgetType }) => ({
          ...widget,
          id: nanoid(),
        })),
        map((widget) => {
          const { properties, initialSize } =
            WidgetPropertiesGeneratorMap[widget.type];

          return {
            ...widget,
            ...initialSize,
            properties,
          };
        })
      )(payload.widgets) satisfies DashboardWidget[];

      const newWidgets = payload.widgets
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
          const { position: position, dimensions } = placeWithinRectangle(
            {
              position: { x: widget.x, y: widget.y },
              dimensions: { height: widget.height, width: widget.width },
            },
            {
              position: { x: 0, y: 0 },
              dimensions: { width: numColumns, height: numRows },
            }
          );

          return {
            ...widget,
            ...position,
            ...dimensions,
          };
        });

      state.dashboardConfiguration.widgets.push(...newWidgets);
    },

    updateWidgets: (
      state,
      { payload }: PayloadAction<{ widgets: DashboardWidget[] }>
    ) => {
      const positionWidgets = evolve((widget: DashboardWidget) => {
        return placeWithinGrid(
          widget,
          gridFromDisplaySettings(state.dashboardConfiguration.displaySettings)
        );
      });

      const positionedWidgets = positionWidgets(payload.widgets);

      state.dashboardConfiguration.widgets = unionBy(
        positionedWidgets,
        state.dashboardConfiguration.widgets,
        ({ id }) => id
      );
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
      const cellSize =
        state.dashboardConfiguration.displaySettings.cellSize ?? 20;
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
          complete ? createRectangle(newSelectionBox) : newSelectionBox
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
          complete ? createRectangle(newSelectionBox) : newSelectionBox
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

    replaceDashboardConfiguration: (
      state,
      {
        payload,
      }: PayloadAction<{ dashboardConfiguration: DashboardConfiguration }>
    ) => {
      state.dashboardConfiguration = payload.dashboardConfiguration;
    },
  },
});

function getWidgetsFromIds({
  widgets,
  widgetIds,
}: {
  widgets: DashboardWidget[];
  widgetIds: string[];
}): DashboardWidget[] {
  return compact(
    widgetIds.map((id) => widgets.find((widget) => widget.id === id))
  );
}

function gridFromDisplaySettings({
  numColumns,
  numRows,
}: Pick<DashboardDisplaySettings, 'numColumns' | 'numRows'>): Grid {
  return createGrid({ width: numColumns, height: numRows });
}
