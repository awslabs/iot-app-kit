/* eslint-disable prefer-const */
import type { SetRequired } from 'type-fest';
import { GRAPH_COLORS } from './constants';
import type { EdgeStyleProps, NodeStyleProps, NodeRenderData } from './types';
import { isNil } from './lib/utils/lang';
import { createSvgString } from './svg';
import type { Health } from './lib/types';
import type { Css, NodeSingular } from 'cytoscape';

export const EDGE_DEFAULT_STYLE_PROPS: SetRequired<EdgeStyleProps, 'targetArrow'> = {
  color: GRAPH_COLORS.GRAY_40,
  targetArrow: {
    color: GRAPH_COLORS.GRAY_40,
    scale: 1.5,
    shape: 'triangle',
  },
  width: 3,
};

export const EDGE_HOVER_STYLE_PROPS: EdgeStyleProps = {
  ...EDGE_DEFAULT_STYLE_PROPS,
  color: GRAPH_COLORS.GRAY_10,
  targetArrow: {
    ...EDGE_DEFAULT_STYLE_PROPS.targetArrow,
    color: GRAPH_COLORS.GRAY_10,
  },
  width: 3,
};

export const EDGE_SELECTED_STYLE_PROPS: EdgeStyleProps = {
  ...EDGE_HOVER_STYLE_PROPS,
  width: 6,
};

export const NODE_DEFAULT_STYLE_PROPS: NodeStyleProps = {
  backgroundImage: getNormalSvg,
  borderWidth: 3,
  labelTextColor: GRAPH_COLORS.GRAY_14,
  labelTextSize: 16,
  labelOffset: 12,
  labelPadding: 8,
  labelPosition: 'bottom',
  shape: getNodeShape,
  transitionDuration: 300,
};

export const NODE_HOVER_STYLE_PROPS: NodeStyleProps = {
  ...NODE_DEFAULT_STYLE_PROPS,
  backgroundImage: getHoverSvg,
  borderColor: GRAPH_COLORS.WHITE,
  labelTextColor: GRAPH_COLORS.WHITE,
};

export const NODE_SELECTED_STYLE_PROPS: NodeStyleProps = {
  ...NODE_DEFAULT_STYLE_PROPS,
  backgroundImage: getSelectedSvg,
  borderColor: GRAPH_COLORS.WHITE,
  borderWidth: 6,
  labelTextColor: GRAPH_COLORS.WHITE,
};

function getNormalSvg(node: NodeSingular) {
  let { isDirty, normalSvg, size, shape, state } = node.data() as NodeRenderData;

  if (isNil(normalSvg) || isDirty) {
    normalSvg = createSvgString({
      ...NODE_DEFAULT_STYLE_PROPS,
      backgroundColor: getNodeColor(state),
      borderColor: getNodeColor(state),
      shape,
      size,
    });
    node.data({ normalSvg: normalSvg, isDirty: false });
  }

  return normalSvg;
}

function getSelectedSvg(node: NodeSingular) {
  let { isDirty, selectedSvg, size, shape, state } = node.data() as NodeRenderData;

  if (isNil(selectedSvg) || isDirty) {
    selectedSvg = createSvgString({ ...NODE_SELECTED_STYLE_PROPS, backgroundColor: getNodeColor(state), shape, size });
    node.data({ selectedSvg: selectedSvg, isDirty: false });
  }

  return selectedSvg;
}
function getHoverSvg(node: NodeSingular) {
  let { hoverSvg, isDirty, size, shape, state } = node.data() as NodeRenderData;

  if (isNil(hoverSvg) || isDirty) {
    hoverSvg = createSvgString({
      ...NODE_HOVER_STYLE_PROPS,
      backgroundColor: getNodeColor(state),
      shape,
      size,
    });
    node.data({ hoverSvg: hoverSvg, isDirty: false });
  }

  return hoverSvg;
}
function getNodeColor(state: Health) {
  switch (state) {
    case 'critical':
      return GRAPH_COLORS.HEALTH_CRITICAL;
    case 'high':
      return GRAPH_COLORS.HEALTH_HIGH;
    case 'low':
      return GRAPH_COLORS.HEALTH_LOW;
    case 'medium':
      return GRAPH_COLORS.HEALTH_MEDIUM;
    case 'offline':
      return GRAPH_COLORS.HEALTH_OFFLINE;
    case 'ok':
      return GRAPH_COLORS.HEALTH_OK;
    default:
      return GRAPH_COLORS.HEALTH_UNKNOWN;
  }
}
function getNodeShape(node: NodeSingular): Css.NodeShape {
  const { shape } = node.data() as any as NodeRenderData;
  if (isNil(shape)) return 'ellipse';
  if (shape === 'hexagon') return 'polygon';
  return shape;
}
