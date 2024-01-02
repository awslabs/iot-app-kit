import * as echarts from 'echarts';

import { TrendCursorModel } from '../model';
import ExtensionAPI from 'echarts/types/src/core/ExtensionAPI';
import { SeriesModel } from 'echarts';
import Axis2D from 'echarts/types/src/coord/cartesian/Axis2D';
import { round } from '@iot-app-kit/core-util';
import useDataStore from '../../../../store';
import { getGrid, getXAxisCoord, getXAxisDataValue } from './utils';
import {
  onDeleteTrendCursor,
  onUpdateTrendCursor,
  onSetTrendCursorValues,
} from '../store/actions';
import { POSITION, SIZE, STYLE, Z } from './constants';

import deleteButtonSvg from './deleteButton.svg';
import { TrendCursor } from '../store';

// Echarts doesn't expose this interface correctly
// eslint-disable-next-line
const { Group, Rect, Line, Text, Image, Circle } = echarts.graphic;

export type SeriesModelRenderInformation = {
  model: SeriesModel;
  // polyline is a namespace here because of how we are accessing
  // it through echarts exports. We can't use it as a type
  // eslint-disable-next-line
  polyline: any;
};

type Position = { x: number; y: number };

type Grid = ReturnType<typeof getGrid>;

type IntersectionPointValue = {
  id: string;
  value: number;
  name: string;
};

// Echarts doesn't expose this interface correctly
// eslint-disable-next-line
export class TrendCursorView extends echarts.ComponentView {
  static type = 'trendCursors';
  readonly type = TrendCursorView.type;

  offset = 0;

  grid: Grid | null = null;
  position: Position | null = null;
  trendCursor: Required<TrendCursor> | null = null;
  api: ExtensionAPI | null = null;
  chartId: string | null = null;

  reset() {
    this.trendCursor = null;
    this.grid = null;
    this.position = null;
    this.group.removeAll();
  }

  dispose(): void {
    this.reset();
  }

  /**
   * helper methods below
   */

  setTrendCursor(model: TrendCursorModel) {
    if (!this.validateModel(model)) return;

    const { id, group, date, color } = model;
    this.trendCursor = { id, group, date, color };
  }
  validateModel(trendCursorModel: {
    id: string;
    group?: string;
    date: number | null;
    color?: string;
  }): trendCursorModel is Required<TrendCursor> {
    const { id, group, date, color } = trendCursorModel;
    if (!id || !group || !date || !color) return false;
    return true;
  }

  handleDeleteTrendCursor({ id, group }: { id: string; group: string }) {
    return () => {
      useDataStore
        .getState()
        .trendCursorsDispatch(onDeleteTrendCursor({ id, group }));
    };
  }

  handleUpdateTrendCursor() {
    return (e: echarts.ElementEvent) => {
      if (!this.trendCursor || !this.api) return;
      const { id, group, color } = this.trendCursor;
      useDataStore.getState().trendCursorsDispatch(
        onUpdateTrendCursor({
          group,
          id,
          date: getXAxisDataValue(e.offsetX - this.offset, this.api),
          color,
        })
      );
    };
  }

  handleUpdateTrendCursorValues(values: IntersectionPointValue[]) {
    if (!this.trendCursor) return;
    const trendCursorId = this.trendCursor.id;
    const trendCursorValues = values.map((value) => ({
      trendCursorId,
      ...value,
    }));
    useDataStore
      .getState()
      .trendCursorsDispatch(onSetTrendCursorValues(trendCursorValues));
  }

  handleSetDragOffset() {
    return (e: echarts.ElementEvent) => {
      if (!this.trendCursor || !this.api) return;
      const { date } = this.trendCursor;
      const currentPosition = getXAxisCoord(date, this.api);
      this.offset = e.offsetX - currentPosition;
    };
  }

  toDateTimeText(date: number) {
    const localeDateString = new Date(date).toLocaleDateString();
    const localeTimeString = new Date(date).toLocaleTimeString();
    const dateTimeText = `{timestamp|${localeDateString} ${localeTimeString}}`;
    return dateTimeText;
  }

  clipPathFromGrip(): echarts.graphic.Rect {
    if (!this.grid) {
      throw new Error('Layout not setup');
    }

    const { x, y, width, height } = this.grid;

    return new Rect({
      shape: {
        x: x,
        y: y + POSITION.Clip.y,
        width: width,
        height: height + POSITION.Clip.height,
      },
    });
  }

  setLayoutInformation() {
    if (!this.trendCursor || !this.api) return;
    const { date } = this.trendCursor;

    const grid = getGrid(this.api);
    this.position = {
      x: getXAxisCoord(date, this.api),
      y: grid.y,
    };
    this.grid = grid;
  }

  createCursorDateText(date: number): echarts.graphic.Text {
    if (!this.position) {
      throw new Error('Layout not setup');
    }
    const text = this.toDateTimeText(date);

    return new Text({
      z: Z.Text,
      style: {
        // does not like the rich timestamp map type
        // eslint-disable-next-line
        ...(STYLE.Text as any),
        x: this.position.x,
        y: this.position.y + POSITION.Text.y,
        text,
      },
    });
  }

  /**
   * Graphic methods below
   */

  createColorBar(color: string): echarts.graphic.Rect {
    if (!this.position) {
      throw new Error('Layout not setup');
    }

    return new Rect({
      z: Z.Color,
      shape: {
        x: this.position.x + POSITION.Color.x,
        y: this.position.y + POSITION.Color.y,
        ...SIZE.Color,
      },
      style: {
        fill: color,
      },
    });
  }

  createDeleteButton({
    id,
    group,
  }: {
    id: string;
    group: string;
  }): echarts.graphic.Image {
    if (!this.position) {
      throw new Error('Layout not setup');
    }

    return new Image({
      z: Z.Delete,
      onclick: this.handleDeleteTrendCursor({ id, group }),
      style: {
        image: deleteButtonSvg as unknown as string,
        x: this.position.x + POSITION.Delete.x,
        y: this.position.y + POSITION.Delete.y,
      },
    });
  }

  createCursorHeader(): echarts.graphic.Group {
    const header = new Group();
    if (!this.trendCursor) {
      return header;
    }
    const { date, color, group, id } = this.trendCursor;

    const textGraphic = this.createCursorDateText(date);

    const colorGraphic = this.createColorBar(color);

    const removeGraphic = this.createDeleteButton({ id, group });

    header.add(textGraphic);
    header.add(colorGraphic);
    header.add(removeGraphic);

    return header;
  }

  createCursorLine(): echarts.graphic.Group {
    const lineGroup = new Group();
    if (!this.position || !this.grid) {
      return lineGroup;
    }

    const grid = this.grid;

    const cursorPositionX = this.position.x;

    const lineStartY = grid.y - POSITION.Line.start;
    const lineEndY = grid.height + grid.y;

    const lineShape = {
      x1: cursorPositionX,
      y1: lineStartY,
      x2: cursorPositionX,
      y2: lineEndY,
    };

    const graphicProps = {
      z: Z.Line,
      shape: lineShape,
    };

    const lineGraphic = new Line({
      ...graphicProps,
      style: {
        lineWidth: SIZE.Line.width,
      },
    });

    // slightly larger invisible line to act as a wider drag handle
    const lineHitbox = new Line({
      ...graphicProps,
      style: {
        opacity: 0,
        lineWidth: SIZE.Line.hitbox,
      },
    });

    lineGroup.add(lineHitbox);
    lineGroup.add(lineGraphic);
    return lineGroup;
  }

  createIntersectionPoint({
    model,
    polyline,
  }: SeriesModelRenderInformation):
    | [echarts.graphic.Circle, IntersectionPointValue]
    | undefined {
    if (
      !this.chartId ||
      !this.position ||
      !this.api ||
      !polyline ||
      !model ||
      !model.coordinateSystem ||
      !model.coordinateSystem.getAxis
    )
      return;
    const yAxis = model.coordinateSystem.getAxis('y') as unknown as Axis2D;

    const intersectionPoint = polyline.getPointOn(this.position.x, 'x');
    if (!intersectionPoint || intersectionPoint.length < 2) return;
    const [x, y] = intersectionPoint;

    const interpolatedTrendCursorValue = yAxis.coordToData(
      yAxis.toLocalCoord(y)
    );
    const precisionValue = round(
      interpolatedTrendCursorValue,
      2 // (model as unknown as GenericSeries).appKitSignificantDigits ?? 4
    );

    const modelStyle = model.getData().getVisual('style');
    const pointGraphic = new Circle({
      z: Z.Point,
      style: {
        fill: modelStyle.fill,
        opacity: modelStyle.opacity,
      },
      shape: { cx: x, cy: y, r: SIZE.Point.radius },
      clipPath: this.clipPathFromGrip(),
    });

    const value = {
      id: this.chartId + model.id,
      value: precisionValue,
      name: model.name,
    };
    return [pointGraphic, value];
  }

  createCursor(): echarts.graphic.Group {
    return new Group({
      clipPath: this.clipPathFromGrip(),
      draggable: 'horizontal',
      onmousedown: this.handleSetDragOffset(),
      ondrag: this.handleUpdateTrendCursor(),
    });
  }

  drawCursor(
    chartId: string,
    trendCursorModel: TrendCursorModel,
    seriesData: SeriesModelRenderInformation[],
    api: ExtensionAPI
  ) {
    this.reset();

    this.chartId = chartId;
    this.api = api;

    this.setTrendCursor(trendCursorModel);

    this.setLayoutInformation();

    const cursor = this.createCursor();
    cursor.add(this.createCursorLine());
    cursor.add(this.createCursorHeader());

    const trendCursorValuesToUpdate: IntersectionPointValue[] = [];

    seriesData.forEach((s) => {
      const [point, value] = this.createIntersectionPoint(s) ?? [];
      if (!point || !value) return;
      trendCursorValuesToUpdate.push(value);
      this.group.add(point);
    });

    this.handleUpdateTrendCursorValues(trendCursorValuesToUpdate);

    this.group.add(cursor);
  }
}
