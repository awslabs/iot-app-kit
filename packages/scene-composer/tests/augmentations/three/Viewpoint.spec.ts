import * as THREE from 'three';

import { ViewCursor, Viewpoint, ViewpointState } from '../../../src';
import { WidgetVisual } from '../../../src/augmentations/three/visuals';

describe('Viewpoint', () => {
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

  it('should be rotated about the X-Axis 90º by default', () => {
    const viewpoint = new Viewpoint();
    viewpoint.add(widgetVisual);

    expect(viewpoint.type).toEqual('Viewpoint');
    expect(viewpoint.rotation.x).not.toEqual(0.0);
  });

  it('should log an error if no name set on widget visual', () => {
    const viewpoint = new Viewpoint();

    const errorLog = jest.spyOn((viewpoint as any).log, 'error');

    viewpoint.add(widgetVisual);

    expect(errorLog).toHaveBeenCalled();
  });

  it('should log an error if no visual set on widget visual', () => {
    const viewpoint = new Viewpoint();
    widgetVisual.name = 'testName';

    const errorLog = jest.spyOn((viewpoint as any).log, 'error');

    viewpoint.add(widgetVisual);

    expect(errorLog).toHaveBeenCalled();
  });

  it('should add a valid visual to children and map', () => {
    const viewpoint = new Viewpoint();
    widgetVisual.name = ViewpointState.Deselected;
    widgetVisual.visual = visualContainer;
    const visualMap = (viewpoint as any).visualMap;

    viewpoint.add(widgetVisual);

    expect(viewpoint.children).toContain(visualContainer);
    expect(visualMap.has(widgetVisual.name)).toEqual(true);
    expect(visualMap.get(widgetVisual.name)).toEqual(widgetVisual);

    expect(widgetVisual.setVisible).toBeCalledWith(true);
  });

  it('should update the visibility if it does not match the state', () => {
    const viewpoint = new Viewpoint();
    widgetVisual.name = ViewpointState.Deselected;
    widgetVisual.visual = visualContainer;

    viewpoint.add(widgetVisual);
    expect(widgetVisual.setVisible).toBeCalledWith(true);

    viewpoint.isSelected = true;

    expect(widgetVisual.setVisible).toBeCalledWith(false);
  });

  describe('ViewCursor', () => {
    it('should have ViewCursor type', () => {
      const viewCursor = new ViewCursor();
      expect(viewCursor.type).toEqual('ViewCursor');
    });
  });
});
