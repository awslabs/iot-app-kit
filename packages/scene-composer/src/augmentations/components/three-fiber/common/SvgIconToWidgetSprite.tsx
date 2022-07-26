import * as THREE from 'three';
import React from 'react';

import { DefaultAnchorStatus } from '../../../../interfaces';
import { WidgetSpriteProps } from '../../../UpdateJsxIntrinsicElements';
import { RenderOrder } from '../../../../common/constants';

export default function svgIconToWidgetSprite(
  svg: string,
  key: DefaultAnchorStatus | string,
  alwaysVisible,
  props?: WidgetSpriteProps,
) {
  if (!THREE.Cache.get(key)) {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const loader = new THREE.TextureLoader();
    const texture = loader.load(url);
    texture.needsUpdate = true;
    texture.encoding = THREE.sRGBEncoding;
    THREE.Cache.add(key, texture);
  }

  const group = new THREE.Group();

  const texture = THREE.Cache.get(key);
  // NOTE: sizeAttenuation is true by default, but I am leaving this as setting it to false is what maintains a constant size.
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, sizeAttenuation: true });
  spriteMaterial.color.convertSRGBToLinear();
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.renderOrder = RenderOrder.DrawLate;

  group.add(sprite);

  if (alwaysVisible) {
    const altSpriteMaterial = spriteMaterial.clone();
    altSpriteMaterial.depthFunc = THREE.GreaterDepth;
    altSpriteMaterial.opacity = 0.5;
    const altSprite = new THREE.Sprite(altSpriteMaterial);
    altSprite.renderOrder = RenderOrder.DrawLate;
    group.add(altSprite);
  }

  return (
    <widgetSprite key={key} name={key} {...props}>
      <primitive object={group.clone()} attach='visual' />
    </widgetSprite>
  );
}
