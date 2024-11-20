export class MockTransformControls {
  static instance;

  object: any = {};
  showY = true;
  flipY = false;
  camera;
  domElement;

  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    MockTransformControls.instance = this;
  }

  static addEventListener = vi.fn();
  static removeEventListener = vi.fn();
  static setMode = vi.fn();
  static attach = vi.fn();
  static detach = vi.fn();

  addEventListener = MockTransformControls.addEventListener;
  removeEventListener = MockTransformControls.removeEventListener;
  setMode = MockTransformControls.setMode;
  attach = MockTransformControls.attach;
  detach = MockTransformControls.detach;
  traverse = vi.fn();
}
