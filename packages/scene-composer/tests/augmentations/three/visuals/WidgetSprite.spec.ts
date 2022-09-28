import * as THREE from 'three';

import { WidgetSprite } from '../../../../src/augmentations/three/visuals';

describe('WidgetSprite', () => {
  let material;
  let visual;
  let anchorGroup;
  let visualContainer;

  beforeEach(() => {
    material = new THREE.SpriteMaterial();
    visual = new THREE.Sprite(material);
    anchorGroup = new THREE.Group();
    visualContainer = new THREE.Group();
    anchorGroup.add(visualContainer);

    visualContainer.add(visual);
    jest.resetAllMocks();
  });

  it('should get and set visual', () => {
    const widgetSprite = new WidgetSprite();
    const original = widgetSprite.visual;
    widgetSprite.visual = visualContainer;

    expect(widgetSprite.visual).not.toEqual(original);
    expect(widgetSprite.visual).toEqual(visualContainer);
  });

  it('should log an warning when trying to call add', () => {
    const widgetSprite = new WidgetSprite();
    jest.spyOn((widgetSprite as any).log, 'warn');

    widgetSprite.add(visualContainer);

    expect((widgetSprite as any).log.warn).toHaveBeenCalled();
  });

  it('should set visual visible state if it has one on setVisible', () => {
    const widgetSprite = new WidgetSprite();
    const visiblity = visualContainer.visible;

    widgetSprite.setVisible(!visiblity);

    expect(visualContainer.visible).toEqual(visiblity);

    widgetSprite.visual = visualContainer;
    widgetSprite.setVisible(!visiblity);

    expect(visualContainer.visible).not.toEqual(visiblity);
  });
});
