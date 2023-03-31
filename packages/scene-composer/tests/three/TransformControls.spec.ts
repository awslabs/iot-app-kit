import * as THREE from 'three';

import { TransformControls } from '../../src/three/TransformControls';
import { fakeScene } from '../fakeScene';

// Helpers
const findObjectsWithRecursive = (
  object: THREE.Object3D,
  name: string,
  type: string,
  tag: string | undefined,
): Array<THREE.Object3D> => {
  const hits = new Array<THREE.Object3D>();

  object.children.forEach((child) => {
    if (child.name === name && child.type === type && (child as any).tag === tag) {
      hits.push(child);
    }
  });

  if (hits.length === 0) {
    object.children.forEach((child) => {
      hits.push(...findObjectsWithRecursive(child, name, type, tag));
    });
  }
  return hits;
};

const getTransformControlAxis = (
  transformControls: TransformControls,
  targetAxis: 'X' | 'Y' | 'Z' | 'XYZ',
  direction: 'fwd' | 'bwd' | undefined,
): THREE.Object3D | undefined => {
  const gizmo: THREE.Object3D = (transformControls as any).gizmo;
  const axisHeads = findObjectsWithRecursive(gizmo, targetAxis, 'Mesh', direction);
  return axisHeads.length > 0 ? axisHeads[0] : undefined;
};

const getScreenSpaceOfObject = (
  object: THREE.Object3D,
  camera: THREE.Camera,
  screenWidth: number,
  screenHeight: number,
): THREE.Vector3 => {
  const widthHalf = screenWidth / 2;
  const heightHalf = screenHeight / 2;

  const screenPosition = object.position.clone();
  screenPosition.project(camera);

  screenPosition.x = screenPosition.x * widthHalf + widthHalf;
  screenPosition.y = -(screenPosition.y * heightHalf) + heightHalf;

  return screenPosition;
};

type PointerType = 'mouse' | 'pen';
interface TestMouseEvent {
  pointerType: PointerType;
  button: number;
  clientX: number;
  clientY: number;
}

const generateBasicMouseEvent = (
  position: { x: number; y: number },
  button = 1,
  pointerType: PointerType = 'mouse',
): TestMouseEvent => {
  return {
    pointerType,
    button,
    clientX: position.x,
    clientY: position.y,
  };
};

// Tests
describe('TransformControls', () => {
  let screenDimensions;
  let camera;
  let domElement;
  let boundingRect;

  let scene;
  let object;

  let transformControls: TransformControls;

  beforeEach(() => {
    screenDimensions = { width: 640, height: 480 };
    camera = new THREE.PerspectiveCamera(45, screenDimensions.width / screenDimensions.height, 1, 1000);
    camera.position.set(0, 0, 5);
    domElement = document.createElement('canvas');
    boundingRect = {
      x: 0,
      y: 0,
      bottom: screenDimensions.height,
      height: screenDimensions.height,
      left: 0,
      right: screenDimensions.width,
      top: 0,
      width: screenDimensions.width,
    };

    scene = new THREE.Scene();
    object = new THREE.Object3D();
    scene.add(object);
    transformControls = new TransformControls(camera, domElement);
    jest.resetAllMocks();
  });

  it('becomes visible after calling attach invisible after calling detach', () => {
    expect(transformControls.visible).toEqual(false);

    transformControls.attach(object);

    expect(transformControls.visible).toEqual(true);

    transformControls.detach();
    expect(transformControls.visible).toEqual(false);
  });

  it('updateMatrixWorld should not call object updateMatrixWorld if not attached', () => {
    const objectUpdateMatrixWorldMock = jest.spyOn(object, 'updateMatrixWorld');
    const cameraUpdateMatrixWorldMock = jest.spyOn(camera, 'updateMatrixWorld');
    const cameraMatrixWorldDecompose = jest.spyOn(camera.matrixWorld, 'decompose');
    transformControls.updateMatrixWorld();

    const privateAccessTransformControls = transformControls as any;
    expect(objectUpdateMatrixWorldMock).not.toBeCalled();
    expect(cameraUpdateMatrixWorldMock).toHaveBeenCalled();
    expect(cameraMatrixWorldDecompose).toHaveBeenCalledWith(
      privateAccessTransformControls.cameraPosition,
      privateAccessTransformControls.cameraQuaternion,
      privateAccessTransformControls.cameraScale,
    );
    expect(privateAccessTransformControls.eye).toEqual(
      privateAccessTransformControls.cameraPosition.sub(privateAccessTransformControls.worldPosition).normalize(),
    );
  });

  it('expected dependencies and log error should be called on object without a parent', () => {
    const object = new THREE.Object3D();

    const objectUpdateMatrixWorldMock = jest.spyOn(object, 'updateMatrixWorld');
    const objectMatrixWorldDecompose = jest.spyOn(object.matrixWorld, 'decompose');
    const cameraUpdateMatrixWorldMock = jest.spyOn(camera, 'updateMatrixWorld');
    const cameraMatrixWorldDecompose = jest.spyOn(camera.matrixWorld, 'decompose');
    transformControls.attach(object);
    transformControls.updateMatrixWorld();

    const privateAccessTransformControls = transformControls as any;
    expect(objectUpdateMatrixWorldMock).toHaveBeenCalled();
    expect(objectMatrixWorldDecompose).toHaveBeenCalledWith(
      privateAccessTransformControls.worldPosition,
      privateAccessTransformControls.worldQuaternion,
      privateAccessTransformControls.worldScale,
    );
    expect(cameraUpdateMatrixWorldMock).toHaveBeenCalled();
    expect(cameraMatrixWorldDecompose).toHaveBeenCalledWith(
      privateAccessTransformControls.cameraPosition,
      privateAccessTransformControls.cameraQuaternion,
      privateAccessTransformControls.cameraScale,
    );
    expect(privateAccessTransformControls.eye).toEqual(
      privateAccessTransformControls.cameraPosition.sub(privateAccessTransformControls.worldPosition).normalize(),
    );
  });

  it('expected dependencies should be called on object and camera', () => {
    const objectUpdateMatrixWorldMock = jest.spyOn(object, 'updateMatrixWorld');
    const objectMatrixWorldDecompose = jest.spyOn(object.matrixWorld, 'decompose');
    const objectParentMatrixWorldDecompose = jest.spyOn(object.parent!.matrixWorld, 'decompose');
    const cameraUpdateMatrixWorldMock = jest.spyOn(camera, 'updateMatrixWorld');
    const cameraMatrixWorldDecompose = jest.spyOn(camera.matrixWorld, 'decompose');
    transformControls.attach(object);
    transformControls.updateMatrixWorld();

    const privateAccessTransformControls = transformControls as any;
    expect(objectUpdateMatrixWorldMock).toHaveBeenCalled();
    expect(objectParentMatrixWorldDecompose).toHaveBeenCalledWith(
      privateAccessTransformControls.parentPosition,
      privateAccessTransformControls.parentQuaternion,
      privateAccessTransformControls.parentScale,
    );
    expect(objectMatrixWorldDecompose).toHaveBeenCalledWith(
      privateAccessTransformControls.worldPosition,
      privateAccessTransformControls.worldQuaternion,
      privateAccessTransformControls.worldScale,
    );
    expect(cameraUpdateMatrixWorldMock).toHaveBeenCalled();
    expect(cameraMatrixWorldDecompose).toHaveBeenCalledWith(
      privateAccessTransformControls.cameraPosition,
      privateAccessTransformControls.cameraQuaternion,
      privateAccessTransformControls.cameraScale,
    );
    expect(privateAccessTransformControls.eye).toEqual(
      privateAccessTransformControls.cameraPosition.sub(privateAccessTransformControls.worldPosition).normalize(),
    );
  });

  it('should add/remove pointerMove event on pointer down and up', async () => {
    jest.spyOn(domElement, 'getBoundingClientRect').mockImplementation(() => boundingRect);
    const testScene = fakeScene(camera, domElement);
    camera.lookAt(testScene.cube.position);
    testScene.transformControls.attach(testScene.cube);
    testScene.transformControls.updateMatrixWorld();

    const axis = getTransformControlAxis(testScene.transformControls, 'Y', 'fwd');
    expect(axis).toBeDefined();

    const pointerLocation = getScreenSpaceOfObject(axis!, camera, screenDimensions.width, screenDimensions.height);
    const testEvent = generateBasicMouseEvent({ x: pointerLocation.x, y: pointerLocation.y });
    // Force dragging for coverage
    (testScene.transformControls as any).dragging = true;
    // TODO: Do not force axis
    (testScene.transformControls as any).axis = 'Y';

    jest.spyOn(domElement.ownerDocument, 'addEventListener');
    (testScene.transformControls as any).onPointerDown(testEvent);

    expect(domElement.ownerDocument.addEventListener).toHaveBeenCalledWith(
      'pointermove',
      (testScene.transformControls as any).onPointerMove,
    );

    jest.spyOn(domElement.ownerDocument, 'removeEventListener');
    (testScene.transformControls as any).onPointerUp(testEvent);

    expect(domElement.ownerDocument.removeEventListener).toHaveBeenCalledWith(
      'pointermove',
      (testScene.transformControls as any).onPointerMove,
    );
  });

  it('should set and get mode', () => {
    const original = transformControls.getMode();
    transformControls.setMode('scale');
    const current = transformControls.getMode();

    expect(original).not.toEqual(current);
    expect(current).toEqual('scale');
  });

  it('should set translationSnap', () => {
    const original = (transformControls as any).translationSnap;
    transformControls.setTranslationSnap(original + 1);
    const current = (transformControls as any).translationSnap;

    expect(original).not.toEqual(current);
    expect(current).toEqual(original + 1);
  });

  it('should set scaleSnap', () => {
    const original = (transformControls as any).scaleSnap;
    transformControls.setScaleSnap(original + 1);
    const current = (transformControls as any).scaleSnap;

    expect(original).not.toEqual(current);
    expect(current).toEqual(original + 1);
  });

  it('should set rotationSnap', () => {
    const original = (transformControls as any).rotationSnap;
    transformControls.setRotationSnap(original + 1);
    const current = (transformControls as any).rotationSnap;

    expect(original).not.toEqual(current);
    expect(current).toEqual(original + 1);
  });

  it('should set Size', () => {
    const original = (transformControls as any).size;
    transformControls.setSize(original + 1);
    const current = (transformControls as any).size;

    expect(original).not.toEqual(current);
    expect(current).toEqual(original + 1);
  });

  it('should set space', () => {
    const original = (transformControls as any).space;
    transformControls.setSpace('local');
    const current = (transformControls as any).space;

    expect(original).not.toEqual(current);
    expect(current).toEqual('local');
  });

  it('should remove events on dispose', () => {
    jest.spyOn(domElement, 'removeEventListener');
    jest.spyOn(domElement.ownerDocument, 'removeEventListener');

    transformControls.dispose();

    expect(domElement.removeEventListener).toHaveBeenCalledWith(
      'pointerdown',
      (transformControls as any).onPointerDown,
    );
    expect(domElement.removeEventListener).toHaveBeenCalledWith(
      'pointermove',
      (transformControls as any).onPointerHover,
    );
    expect(domElement.ownerDocument.removeEventListener).toHaveBeenCalledWith(
      'pointermove',
      (transformControls as any).onPointerMove,
    );
    expect(domElement.ownerDocument.removeEventListener).toHaveBeenCalledWith(
      'pointerup',
      (transformControls as any).onPointerUp,
    );
  });
});
