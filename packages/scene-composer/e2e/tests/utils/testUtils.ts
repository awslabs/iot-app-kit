import { Object3D } from 'three';

export default class R3FTestHarness {
  testScene;

  constructor(scene: Object3D) {
    this.testScene = scene;
  }

  // Get Scene
  get getScene() {
    return this.testScene;
  }

  // Get Object
  /*
   * Returns scene object
   * `name` as string
   */
  async getObjecByName(name: string) {
    return this.testScene.getObjectByName(name)
  }
  // getObjecByName = async (name: string) => {
  //   return this.testScene.getObjectByName(name)
  // }

  // Look At Object
  /*


  */
  // lookAtRef(ref: string) {
  //   const setCameraTarget = useStore(this.sceneComposerId).getState().setCameraTarget;
  //   setCameraTarget(ref, 'teleport');
  // };

  // Delete Object
  /*
   * Remove object from scene
   */
  //   deleteObject(obj: Object3D) {
  //     // return this.testScene.remove(obj)
  // };

  // Scale Object
  /*
   * Modify scale of object on x, y, z props
   * Takes `scale` prop as Vector3 object
   */
  //   scaleObject(scale: THREE.Vector3) {
  //     console.log('implement scaleObject')
  //     return this.testScene.scale()
  // };

  // Rotate Object
  /*


  */
  //   rotateObjec(ref: string) {
  //     console.log('implement rotateObjec')
  // };

  // Move Object
  /*


  */
  //   moveObject(ref: string) {
  //     console.log('implement moveObject')
  // };

  // Select / Click Object
  /*


  */
  //   selectObject(ref: string) {
  //     console.log('implement selectObject')
  // };

  // Add Tag
  /*


  */
  //   addTag(ref: string) {
  //     console.log('implement addTag')
  // };

  // Place Object
  /*


  */
  //   placeObject(ref: string) {
  //     console.log('implement placeObject')
  // };

  // Undo Edit
  /*


  */
  //   undoEdit(ref: string) {
  //     console.log('implement undoEdit')
  // };

  // Redo Edit
  /*


  */
  //   redoEdit(ref: string) {
  //     console.log('implement redoEdit')
  // };

  // window['TMGetObject'] = (typeof window === 'undefined') ? undefined : getObjectByName;
  // window['TMlookAt'] = (typeof window === 'undefined') ? undefined : lookAtRef;
  // window['TwinMakerScene'] = (typeof window === 'undefined') ? undefined : scene;
}

/*

jackwindow[0].TMGetObject("PalletJ )
part1window[0].TMGetObject("Scene49 )

window[0].TMlookAt(jack.userData.componentRef)

window[0].TwinMakerScene

*/
