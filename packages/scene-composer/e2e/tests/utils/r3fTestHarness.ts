import { type Object3D } from 'three';

export default class R3FTestHarness {
  scene;
  sceneId;

  constructor(scene: Object3D, sceneId: string) {
    this.scene = scene;
    this.sceneId = sceneId;
  }

  // Get Object By Name
  /*
   * Returns scene object
   * `name` as string
   */
  async getObjecByName(name: string) {
    return this.scene.getObjectByName(name);
  }
}
