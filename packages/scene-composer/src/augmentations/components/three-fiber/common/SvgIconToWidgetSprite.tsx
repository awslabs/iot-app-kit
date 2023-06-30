import * as THREE from 'three';
import React from 'react';

import { DefaultAnchorStatus } from '../../../../interfaces';
import { WidgetSpriteProps } from '../../../UpdateJsxIntrinsicElements';
import { RenderOrder } from '../../../../common/constants';
import { useSvgParser } from '../../../../components/panels/scene-components/tag-style/ColorPicker/useSvgParser';

export default function svgIconToWidgetSprite(
  svg: string,
  key: DefaultAnchorStatus | string,
  alwaysVisible,
  sizeAttenuation: boolean, // when true, tag size changes when zooming
  props?: WidgetSpriteProps,
  choosenColor?: string
) {
  const { svgCode } = useSvgParser({
    selectedColor: choosenColor!,
    iconString: svg
  })
  if (svgCode && !THREE.Cache.get(key)) {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const loader = new THREE.TextureLoader();
    const texture = loader.load(url);
    texture.needsUpdate = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.format = THREE.RGBAFormat;
    texture.type = THREE.UnsignedByteType;
    THREE.Cache.add(key, texture);
  }

  const texture = THREE.Cache.get(key);

  return (
    <widgetSprite key={key} name={key} {...props}>
      <group attach='visual'>
        <sprite renderOrder={RenderOrder.DrawLate}>
          <spriteMaterial
            key={sizeAttenuation ? 'change-size' : 'constant-size'}
            map={texture}
            sizeAttenuation={sizeAttenuation}
          />
        </sprite>
        {alwaysVisible && (
          <sprite renderOrder={RenderOrder.DrawLate}>
            <spriteMaterial
              key={sizeAttenuation ? 'change-size' : 'constant-size'}
              map={texture}
              sizeAttenuation={sizeAttenuation}
              depthFunc={THREE.GreaterDepth}
              opacity={0.5}
            />
          </sprite>
        )}
      </group>
    </widgetSprite>
  );
}
