import * as THREE from 'three';

import DebugLogger from '../../../logger/DebugLogger';

import { IVisual } from '.';

/**
 * Represents a Visual for a widget.
 * NOTE: This is only an Object3D because the add method for children is otherwise not called on a Widget.
 */
export class WidgetVisual extends THREE.Object3D implements IVisual {
  private log = new DebugLogger('WidgetVisual');

  protected _visual?: THREE.Object3D;

  public alwaysLookAtCamera = false;

  constructor() {
    super();
    this.type = 'WidgetVisual';
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

    if (this.alwaysLookAtCamera && this._visual) {
      const mesh = this.findTopLevelMesh(this._visual);

      if (mesh) {
        mesh.onBeforeRender = (renderer, scene, camera) => {
          // This assumes the structure of the visual's parent node.
          // Not ideal, but we need to change the look at of the group
          // instead of individual meshes to correctly render SVGs.
          const group = this._visual?.parent;
          if (group) {
            group.lookAt(camera.position);
          }
        };
      }
    }
  }

  private findTopLevelMesh(object: THREE.Object3D): THREE.Mesh | null {
    if (object instanceof THREE.Mesh) {
      return object as THREE.Mesh;
    }

    // Check top level first
    let i: number;
    for (i = 0; i < object.children.length; ++i) {
      if (object.children[i] instanceof THREE.Mesh) {
        return object.children[i] as THREE.Mesh;
      }
    }

    for (i = 0; i < object.children.length; ++i) {
      const mesh = this.findTopLevelMesh(object.children[i]);

      if (mesh) {
        return mesh;
      }
    }

    return null;
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
    this.log.warn('Children cannot be added to sn object of type WidgetVisual');
    return this;
  }
}
