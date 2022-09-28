import * as THREE from 'three';

import { Anchor, DefaultAnchorStatus, SelectedAnchor } from '../../../src';
import { WidgetVisual } from '../../../src/augmentations/three/visuals';

describe('Anchor', () => {
  let boxGeometry;
  let material;
  let visual;
  let visualContainer;
  let widgetVisual;

  beforeEach(() => {
    boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial();
    visual = new THREE.Mesh(boxGeometry, material);
    visualContainer = new THREE.Group();
    visualContainer.add(visual);
    widgetVisual = new WidgetVisual();
    jest.spyOn(widgetVisual, 'setVisible');
    jest.resetAllMocks();
  });

  it('should log an error if no name set on widget visual', () => {
    const anchor = new Anchor();

    const errorLog = jest.spyOn((anchor as any).log, 'error');

    anchor.add(widgetVisual);

    expect(errorLog).toHaveBeenCalled();
  });

  it('should log an error if no visual set on widget visual', () => {
    const anchor = new Anchor();
    widgetVisual.name = 'testName';

    const errorLog = jest.spyOn((anchor as any).log, 'error');

    anchor.add(widgetVisual);

    expect(errorLog).toHaveBeenCalled();
  });

  it('should add a valid visual to children and map', () => {
    const anchor = new Anchor();
    widgetVisual.name = DefaultAnchorStatus.Info;
    widgetVisual.visual = visualContainer;
    const visualMap = (anchor as any).visualMap;

    anchor.add(widgetVisual);

    expect(anchor.children).toContain(visualContainer);
    expect(visualMap.has(widgetVisual.name)).toEqual(true);
    expect(visualMap.get(widgetVisual.name)).toEqual(widgetVisual);

    expect(widgetVisual.setVisible).toBeCalledWith(true);
  });

  it('should update the visibility if it does not match the state', () => {
    const anchor = new Anchor();
    widgetVisual.name = DefaultAnchorStatus.Info;
    widgetVisual.visual = visualContainer;

    anchor.add(widgetVisual);
    expect(widgetVisual.setVisible).toBeCalledWith(true);

    anchor.visualState = DefaultAnchorStatus.Error;

    expect(widgetVisual.setVisible).toBeCalledWith(false);
  });

  it('Should maintain scale if parent object scales', () => {
    const parentGeometry = new THREE.BoxGeometry(5, 5, 5);
    const parentMaterial = new THREE.MeshBasicMaterial();
    const parentMesh = new THREE.Mesh(parentGeometry, parentMaterial);

    const anchor = new Anchor();
    anchor.add(widgetVisual);

    parentMesh.add(anchor);
    parentMesh.updateMatrixWorld(true); // Called each frame by ThreeJS

    const originalScale = new THREE.Vector3(1, 1, 1);
    const newScale = new THREE.Vector3(0.05, 0.05, 0.05);
    expect(anchor.scale.equals(originalScale)).toEqual(true);
    expect(parentMesh.scale.equals(originalScale)).toEqual(true);

    parentMesh.scale.copy(newScale);

    expect(anchor.scale.equals(originalScale)).toEqual(true);
    expect(parentMesh.scale.equals(newScale)).toEqual(true);
  });

  it('should update the visibility of "Selected" visual when isSelected', () => {
    const anchor = new Anchor();
    widgetVisual.name = DefaultAnchorStatus.Info;
    widgetVisual.visual = visualContainer;

    const selectedVisual = new WidgetVisual();
    selectedVisual.name = SelectedAnchor;
    selectedVisual.visual = visualContainer;
    jest.spyOn(selectedVisual, 'setVisible');

    anchor.add(widgetVisual);
    anchor.add(selectedVisual);

    expect(anchor.isSelected).toEqual(false);
    expect(widgetVisual.setVisible).toBeCalledWith(true);
    expect(selectedVisual.setVisible).toBeCalledWith(false);
    jest.clearAllMocks();

    anchor.isSelected = true;
    expect(widgetVisual.setVisible).not.toBeCalled();
    expect(selectedVisual.setVisible).toBeCalledWith(true);
  });
});
