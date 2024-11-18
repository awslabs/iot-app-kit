import { type Node, type Object3DNode } from '@react-three/fiber';

import { type Anchor } from './three';
import { type WidgetSprite, type WidgetVisual } from './three/visuals';

export type AnchorProps = Object3DNode<Anchor, typeof Anchor>;

export type WidgetVisualProps = Node<WidgetVisual, typeof WidgetVisual>;

export type WidgetSpriteProps = Node<WidgetSprite, typeof WidgetSprite>;

/**
 * Adds the Anchor type and props to the JSX.IntrinsicElements namespace
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      anchor: AnchorProps;
      widgetVisual: WidgetVisualProps;
      widgetSprite: WidgetSpriteProps;
    }
  }
}
