export class MockTransformControls {
  static instance;

  object: any = {};
  showY = true;
  camera;
  domElement;

  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    MockTransformControls.instance = this;
  }

  static addEventListener = jest.fn();
  static removeEventListener = jest.fn();
  static setMode = jest.fn();
  static attach = jest.fn();
  static detach = jest.fn();

  addEventListener = MockTransformControls.addEventListener;
  removeEventListener = MockTransformControls.removeEventListener;
  setMode = MockTransformControls.setMode;
  attach = MockTransformControls.attach;
  detach = MockTransformControls.detach;
}
