// TODO: A lot of this is probably overkill, and should not be exposed in our public api or types. We should be explicit about styling with our components, and it should be exposed as part of
// the CloudScape theme API, as opposed to adhoc styling of our components.

import type {
  CollectionEventName,
  Css,
  EdgeDataDefinition,
  GraphEventName,
  NodeDataDefinition,
  NodeSingular,
  UserInputDeviceEventName,
  UserInputDeviceEventNameExt,
} from 'cytoscape';
import { INodeResults } from '../interfaces/kgDataSourceInterfaces';
import type { ValueOf } from 'type-fest';

export type layoutTypes =
  | 'preset'
  | 'random'
  | 'grid'
  | 'circle'
  | 'concentric'
  | 'breadthfirst'
  | 'cose'
  | 'cise';

export type EdgeStyleProps = {
  color: string;
  curveStyle?: ValueOf<cytoscape.Css.Edge, 'curve-style'>;
  dashOffset?: ValueOf<cytoscape.Css.Edge, 'line-dash-offset'>;
  dashPattern?: ValueOf<cytoscape.Css.Edge, 'line-dash-pattern'>;
  endCap?: ValueOf<cytoscape.Css.Edge, 'line-cap'>;
  lineStyle?: ValueOf<cytoscape.Css.Edge, 'line-style'>;
  midSourceArrow?: EdgeArrowStyleProps;
  midTargetArrow?: EdgeArrowStyleProps;
  opacity?: number;
  sourceArrow?: EdgeArrowStyleProps;
  sourceEndpoint?: EdgeEndpoint;
  targetArrow?: EdgeArrowStyleProps;
  targetEndpoint?: EdgeEndpoint;
  width: number;
};

export type EdgeArrowStyleProps = {
  color: ValueOf<cytoscape.Css.Edge, 'target-arrow-color'>;
  fill?: ValueOf<cytoscape.Css.Edge, 'target-arrow-fill'>;
  shape: ValueOf<cytoscape.Css.Edge, 'target-arrow-shape'>;
  scale?: ValueOf<cytoscape.Css.Edge, 'arrow-scale'>;
};

export type EdgeData = EdgeDataDefinition & {
  id: string;
  dashPattern?: ValueOf<EdgeStyleProps, 'dashPattern'>;
  lineStyle?: ValueOf<EdgeStyleProps, 'lineStyle'>;
};

export type EdgeRenderData = EdgeData;

export type EdgeEndpoint =
  | 'outside-to-node'
  | 'outside-to-node-or-label'
  | 'inside-to-node'
  | 'outside-to-line'
  | 'outside-to-line-or-label';

export type NodeData = NodeDataDefinition & {
  entityData?: INodeResults;
  id: string;
  label: string;
  shape?: Css.NodeShape;
};

export type NodeShape = Css.NodeShape;

export type NodeRenderData = NodeData & {
  hoverSvg?: string;
  isDirty: boolean;
  normalSvg?: string;
  selectedSvg?: string;
  size: number;
};

export type NodeStyleProps = {
  backgroundColor?: string;
  backgroundImage?: (node: NodeSingular) => string | string;
  backgroundOpacity?: number;
  borderColor?: string;
  borderWidth: number;
  labelBackgroundColor?: string;
  labelTextColor?: string;
  labelTextSize: number;
  labelOffset: number;
  labelPadding?: number;
  labelPosition: 'top' | 'right' | 'bottom' | 'left';
  shape?: (node: NodeSingular) => Css.NodeShape;
  transitionDuration?: number;
  transitionEasing?: ValueOf<cytoscape.Css.Node, 'transition-timing-function'>;
  zIndex?: number;
};

export type Subscriber = (ev: EventDetail) => void;
export type EventDetail = {
  eventName: EventName;
  data?: NodeData | EdgeData;
};
export type EventName =
  | CollectionEventName
  | GraphEventName
  | UserInputDeviceEventName
  | UserInputDeviceEventNameExt;
