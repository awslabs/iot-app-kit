import * as THREE from 'three';

import DebugLogger from '../../logger/DebugLogger';

import { WidgetVisual } from './visuals';

export enum ViewpointState {
  Deselected = 'Deselected',
  Selected = 'Selected',
}

/**
 * The generic Viewpoint object.
 */
export class Viewpoint extends THREE.Object3D {
  private log = new DebugLogger('Viewpoint');

  protected visualMap = new Map<string, WidgetVisual>();
  protected _visualState: string = ViewpointState.Deselected;

  constructor() {
    super();
    this.type = 'Viewpoint';
    this.rotateX(THREE.MathUtils.degToRad(90));
  }

  // @ts-ignore
  public add(visualWithStateName: WidgetVisual): this {
    const stateName = visualWithStateName.name;
    if (!stateName) {
      this.log?.error('A name must be provided for the visual. This is used to determine its appearance.');
      return this;
    }

    if (!visualWithStateName.visual) {
      this.log?.error('A visual must be provided.');
      return this;
    }

    // NOTE: Add the states directly, because event bubbling to the anchor level does not seem to occur on click
    //  and is instead caught by the WidgetVisual
    super.add(visualWithStateName.visual);

    this.visualMap.set(stateName, visualWithStateName);

    // Update the visual with the current visual state
    this.updateVisualState();

    return this;
  }

  public set isSelected(value: boolean) {
    this._visualState = value ? ViewpointState.Selected : ViewpointState.Deselected;
    this.updateVisualState();
  }

  public get isSelected(): boolean {
    return this._visualState === ViewpointState.Selected;
  }

  private updateVisualState() {
    this.visualMap.forEach((visual, name) => {
      visual.setVisible(name === this._visualState);
    });
  }
}

export class ViewCursor extends Viewpoint {
  constructor() {
    super();
    this.type = 'ViewCursor';
  }
}
