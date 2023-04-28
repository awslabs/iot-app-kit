import type { NodeSingular } from 'cytoscape';

import {
  NODE_HEXAGON_HEXAGON_POINTS,
  NODE_DIAMOND_DEFAULT_SIZE,
  NODE_HEXAGON_DEFAULT_SIZE,
  NODE_ELLIPSE_DEFAULT_SIZE,
  NODE_RECTANGLE_DEFAULT_SIZE,
} from './constants';
import type { NodeRenderData, NodeShape, NodeStyleProps } from './types';

/**
 * Returns a SVG string for the `shape`. Defaults to `ellipse`.
 */
export function createSvgString({
  backgroundColor,
  borderColor,
  borderWidth,
  shape,
  size,
}: Pick<NodeStyleProps, 'backgroundColor' | 'borderColor' | 'borderWidth'> & {
  shape?: NodeShape;
  size: number;
}) {
  switch (shape) {
    case 'diamond':
      return createDiamondSvgString({
        backgroundColor,
        borderColor,
        borderWidth,
        size,
      });
    case 'hexagon':
      return createHexagonSvgString({
        backgroundColor,
        borderColor,
        borderWidth,
        size,
      });
    case 'rectangle':
      return createRectangleSvgString({
        backgroundColor,
        borderColor,
        borderWidth,
        size,
      });
    default:
      return createEllipseSvgString({
        backgroundColor,
        borderColor,
        borderWidth,
        size,
      });
  }
}

/**
 * Returns the polygon points based on the `shape`. Defaults to `[]`.
 */
export function getPolygonPoints(node: NodeSingular) {
  const { shape } = node.data() as NodeRenderData;

  switch (shape) {
    case 'hexagon':
      return NODE_HEXAGON_HEXAGON_POINTS;
    default:
      // default to ellipse
      return [];
  }
}

/**
 * Returns the SVG size based on the `shape`. Defaults to `ellipse` size.
 */
export function getSvgSize(shape?: NodeShape) {
  switch (shape) {
    case 'diamond':
      return NODE_DIAMOND_DEFAULT_SIZE;
    case 'hexagon':
      return NODE_HEXAGON_DEFAULT_SIZE;
    case 'rectangle':
      return NODE_RECTANGLE_DEFAULT_SIZE;
    default:
      // default to ellipse
      return NODE_ELLIPSE_DEFAULT_SIZE;
  }
}

// private

function createDiamondSvgString({
  backgroundColor,
  borderColor,
  borderWidth,
  size,
}: Pick<NodeStyleProps, 'backgroundColor' | 'borderColor' | 'borderWidth'> & {
  size: number;
}) {
  const center = size / 2;
  const squareSize = Math.floor(size * Math.sin(Math.PI / 4));
  const halfSize = squareSize / 2;
  const contentSize = squareSize - borderWidth * 2;
  const halfContentSize = contentSize / 2;

  return `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <g fill="none" fill-rule="evenodd" transform="rotate(45 ${center} ${center})">
        <rect width="${squareSize}" height="${squareSize}" x="${center - halfSize}" y="${
    center - halfSize
  }" fill="${borderColor}" />
        <rect width="${contentSize}" height="${contentSize}" x="${center - halfContentSize}" y="${
    center - halfContentSize
  }" fill="${backgroundColor}" />
      </g>
    </svg>`)}`;
}

function createEllipseSvgString({
  backgroundColor,
  borderColor,
  borderWidth,
  size,
}: Pick<NodeStyleProps, 'backgroundColor' | 'borderColor' | 'borderWidth'> & {
  size: number;
}) {
  const halfSize = size / 2;
  const contentSize = (size - borderWidth * 2) / 2;

  return `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <g fill="none" fill-rule="evenodd">
        <circle cx="${halfSize}" cy="${halfSize}" r="${halfSize}" fill="${borderColor}" />
        <circle cx="${halfSize}" cy="${halfSize}" r="${contentSize}" fill="${backgroundColor}" />
      </g>
    </svg>`)}`;
}

function createHexagonSvgString({
  backgroundColor,
  borderColor,
  borderWidth,
  size,
}: Pick<NodeStyleProps, 'backgroundColor' | 'borderColor' | 'borderWidth'> & {
  size: number;
}) {
  const factor = 87 / 100;
  const halfSize = size / 2;
  const outerPoints = getHexagonSvgPoints(halfSize);
  const innerPoints = getHexagonSvgPoints(halfSize - 1 - borderWidth);

  return `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="${size * factor}" height="${size}">
      <g transform="translate(${halfSize * factor}, ${halfSize})">
        <polygon fill="${borderColor}" points="${outerPoints.join(' ')}" />
        <polygon fill="${backgroundColor}" points="${innerPoints.join(' ')}" />
      </g>
    </svg>`)}`;
}

function createRectangleSvgString({
  backgroundColor,
  borderColor,
  borderWidth,
  size,
}: Pick<NodeStyleProps, 'backgroundColor' | 'borderColor' | 'borderWidth'> & {
  size: number;
}) {
  const contentSize = size - borderWidth * 2;

  return `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" fill="${borderColor}" />
      <rect x="${borderWidth}" y="${borderWidth}" width="${contentSize}" height="${contentSize}"  fill="${backgroundColor}" />
    </svg>`)}`;
}

function getHexagonSvgPoints(radius: number) {
  const points: number[] = [];
  //const factor = 87 / 100;

  for (let i = 0; i < NODE_HEXAGON_HEXAGON_POINTS.length; i += 2) {
    points.push(NODE_HEXAGON_HEXAGON_POINTS[i] * radius, NODE_HEXAGON_HEXAGON_POINTS[i + 1] * radius);
  }
  return points;
}
