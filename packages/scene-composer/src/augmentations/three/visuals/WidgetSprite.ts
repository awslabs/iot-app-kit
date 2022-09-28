import * as THREE from 'three';

import DebugLogger from '../../../logger/DebugLogger';

import { IVisual } from '.';

/**
 * Represents a Visual for a widget.
 * NOTE: This is only an Object3D because the add method for children is otherwise not called on a Widget.
 */
export class WidgetSprite extends THREE.Object3D implements IVisual {
  private log = new DebugLogger('WidgetSprite');

  protected _visual?: THREE.Object3D;

  constructor() {
    super();
    this.type = 'WidgetSprite';
  }

  /**
   * Gets the visual state visual.
   */
  public get visual(): THREE.Object3D | undefined {
    return this._visual;
  }

  /**
   * Sets the visual state visual
   */
  public set visual(value: THREE.Object3D | undefined) {
    this._visual = value;
  }

  public setVisible(value: boolean) {
    if (this.visual) {
      this.visual.visible = value;
    }
  }

  /**
   * Disables the add function for this Object3D.
   */
  public add(object: THREE.Object3D): this {
    this.log.warn('Children cannot be added to sn object of type WidgetSprite');
    return this;
  }
}
