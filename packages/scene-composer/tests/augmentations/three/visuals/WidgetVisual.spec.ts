import * as THREE from 'three';

import { WidgetVisual } from '../../../../src/augmentations/three/visuals';

describe('WidgetVisual', () => {
  let boxGeometry;
  let material;
  let visual;
  let anchorGroup;
  let visualContainer;

  beforeEach(() => {
    boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial();
    visual = new THREE.Mesh(boxGeometry, material);
    anchorGroup = new THREE.Group();
    visualContainer = new THREE.Group();
    anchorGroup.add(visualContainer);

    visualContainer.add(visual);
    jest.resetAllMocks();
  });

  it('should get and set visual', () => {
    const widgetVisual = new WidgetVisual();
    const original = widgetVisual.visual;
    widgetVisual.visual = visualContainer;

    expect(widgetVisual.visual).not.toEqual(original);
    expect(widgetVisual.visual).toEqual(visualContainer);
  });

  it('should set root visual onBeforeRender to call its lookAt', () => {
    jest.spyOn(anchorGroup, 'lookAt');
    const widgetVisual = new WidgetVisual();
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(1, 2, 3);
    const originalOnBeforeRender = visual.onBeforeRender;
    widgetVisual.alwaysLookAtCamera = true;
    widgetVisual.visual = visualContainer;

    expect(visual.onBeforeRender).not.toBe(originalOnBeforeRender);

    const anyObject = {} as any;
    visual.onBeforeRender(anyObject, anyObject, camera, anyObject, anyObject, anyObject);

    expect(anchorGroup.lookAt).toHaveBeenCalledWith(camera.position);
  });

  it('should return null when calling findTopLevelMesh if given object with no mesh', () => {
    const widgetVisual = new WidgetVisual();
    const findTopLevelMesh = (widgetVisual as any).findTopLevelMesh;

    expect(findTopLevelMesh(new THREE.Group())).toBeNull();
  });

  it('should return mesh when calling findTopLevelMesh if given visual', () => {
    const widgetVisual = new WidgetVisual();
    const findTopLevelMesh = (widgetVisual as any).findTopLevelMesh;

    expect(findTopLevelMesh(visual)).toBe(visual);
  });

  it('should return mesh when calling findTopLevelMesh if given group with child mesh', () => {
    const widgetVisual = new WidgetVisual();
    const findTopLevelMesh = (widgetVisual as any).findTopLevelMesh;

    expect(findTopLevelMesh(visualContainer)).toBe(visual);
  });

  it('should return mesh when calling findTopLevelMesh if given group with grandchild mesh', () => {
    const widgetVisual = new WidgetVisual();
    const findTopLevelMesh = (widgetVisual as any).findTopLevelMesh.bind(widgetVisual);
    const grandparentGroup = new THREE.Group();
    grandparentGroup.add(visualContainer);

    expect(findTopLevelMesh(grandparentGroup)).toBe(visual);
  });

  it('should log an warning when trying to call add', () => {
    const widgetVisual = new WidgetVisual();
    jest.spyOn((widgetVisual as any).log, 'warn');

    widgetVisual.add(visualContainer);

    expect((widgetVisual as any).log.warn).toHaveBeenCalled();
  });

  it('should set visual visible state if it has one on setVisible', () => {
    const widgetVisual = new WidgetVisual();
    const visiblity = visualContainer.visible;

    widgetVisual.setVisible(!visiblity);

    expect(visualContainer.visible).toEqual(visiblity);

    widgetVisual.visual = visualContainer;
    widgetVisual.setVisible(!visiblity);

    expect(visualContainer.visible).not.toEqual(visiblity);
  });
});
