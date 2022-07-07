import * as THREE from 'three';

import DebugLogger from '../../logger/DebugLogger';
import { DefaultAnchorStatus, SelectedAnchor } from '../../interfaces';

import { IVisual } from './visuals';

/**
 * The generic anchor object.
 */
export class Anchor extends THREE.Object3D {
  private log = new DebugLogger('Anchor');

  protected visualMap = new Map<string, IVisual>();
  protected _visualState: DefaultAnchorStatus | string = DefaultAnchorStatus.Info;
  protected _isSelected = false;

  // @ts-ignore
  public add(visualWithStateName: IVisual): this {
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

    // Update the anchor visual with the current visual state
    this.updateVisualState();

    return this;
  }

  public set visualState(visualState: DefaultAnchorStatus | string) {
    this._visualState = visualState;
    this.updateVisualState();
  }

  public get visualState(): DefaultAnchorStatus | string {
    return this._visualState;
  }

  /**
   * Gets the anchor's selected state
   */
  public get isSelected(): boolean {
    return this._isSelected;
  }

  /**
   * Sets the anchor's selected state keying the visibility of the specially named Selected Visual
   * @param value true if the anchor is selected
   */
  public set isSelected(value: boolean) {
    this._isSelected = value;
    this.visualMap.get(SelectedAnchor)?.setVisible(value);
  }

  private updateVisualState() {
    this.visualMap.forEach((visual, name) => {
      visual.setVisible(name === this.visualState);
    });
  }

  /**
   * Customized UpdateMatrixWorld for the Object3D
   */
  public updateMatrixWorld = (force?: boolean) => {
    if (this.matrixAutoUpdate) {
      this.updateMatrix();
    }

    if (this.matrixWorldNeedsUpdate || force) {
      // Handles the impossible case that an anchor has no parent. We always have a scene so it is not possible to hit
      if (this.parent === null) {
        this.matrixWorld.copy(this.matrix);
      } else {
        const parentTranslation = new THREE.Vector3();
        const parentRotation = new THREE.Quaternion();
        this.parent.matrixWorld.decompose(parentTranslation, parentRotation, new THREE.Vector3());

        const descaledParentMatrixWorld = new THREE.Matrix4().compose(
          parentTranslation,
          parentRotation,
          new THREE.Vector3(1, 1, 1),
        );

        this.matrixWorld.multiplyMatrices(descaledParentMatrixWorld, this.matrix);
      }

      this.matrixWorldNeedsUpdate = false;

      force = true;
    }

    // Update children
    const children = this.children;
    for (let i = 0, l = children.length; i < l; i++) {
      children[i].updateMatrixWorld(force);
    }
  };
}
