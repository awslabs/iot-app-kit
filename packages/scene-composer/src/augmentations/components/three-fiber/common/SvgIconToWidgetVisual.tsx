import * as THREE from 'three';
import React from 'react';
import { SVGLoader, SVGResult } from 'three-stdlib';

import { DefaultAnchorStatus } from '../../../../interfaces';
import { WidgetVisualProps } from '../../../UpdateJsxIntrinsicElements';
import { RenderOrder } from '../../../../common/constants';

function resetObjectCenter(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  box.getCenter(object.position); // this re-sets the mesh position
  object.position.multiplyScalar(-1);
}

export default function svgIconToWidgetVisual(
  svgData: SVGResult,
  key: DefaultAnchorStatus | string,
  alwaysVisible,
  props?: WidgetVisualProps,
) {
  const paths = svgData.paths;
  const group = new THREE.Group();

  group.scale.multiplyScalar(0.01);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const strokeColor = path.userData?.style?.stroke;
    const opacity = path.userData?.style?.opacity || 1;

    if (strokeColor && strokeColor !== 'none') {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle(strokeColor).convertSRGBToLinear(),
        opacity,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
        const subPath = path.subPaths[j];
        const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData!.style);
        if (geometry) {
          const mesh = new THREE.Mesh(geometry, material);

          const altMat = material.clone();
          altMat.depthFunc = THREE.GreaterDepth;
          altMat.color = altMat.color.lerp(new THREE.Color(0, 0, 0), 0.5);
          const altMesh = new THREE.Mesh(geometry.clone(), altMat);

          // This is a render order hack to avoid strange rendering effect when adding new meshes to the scene.
          // This render order ensures the anchors are rendered later than the base geometry.
          mesh.renderOrder = RenderOrder.DrawLate;
          altMesh.renderOrder = RenderOrder.DrawLate;
          resetObjectCenter(mesh);
          resetObjectCenter(altMesh);

          group.add(mesh);
          if (alwaysVisible) {
            group.add(altMesh);
          }
        }
      }
    }

    const fillColor = path.userData?.style?.fill;
    if (fillColor && fillColor !== 'none') {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle(fillColor).convertSRGBToLinear(),
        opacity,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      // TODO: SVGLoader does not support getting smooth path, it uses default number of divisions in the getPoints call
      // see: https://github.com/mrdoob/three.js/blob/e62b253081438c030d6af1ee3c3346a89124f277/src/extras/core/CurvePath.js#L155
      //      https://github.com/pmndrs/three-stdlib/blob/2815d8e00ce3ae79a9b6891e852e03f18391d60a/src/loaders/SVGLoader.js#L1609
      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);

        const altMat = material.clone();
        altMat.depthFunc = THREE.GreaterDepth;
        altMat.color = altMat.color.lerp(new THREE.Color(0, 0, 0), 0.5);
        const altMesh = new THREE.Mesh(geometry.clone(), altMat);

        // This is a render order hack to avoid strange rendering effect when adding new meshes to the scene.
        // This render order ensures the anchors are rendered later than the base geometry.
        mesh.renderOrder = RenderOrder.DrawLate;
        altMesh.renderOrder = RenderOrder.DrawLate;
        resetObjectCenter(mesh);
        resetObjectCenter(altMesh);

        group.add(mesh);
        if (alwaysVisible) {
          group.add(altMesh);
        }
      }

      // add a flag to avoid double-centering the group when the scene is
      // re-rendered, which will cancel the effect.
      if (!group.userData.__centered) {
        resetObjectCenter(group);
        group.renderOrder = RenderOrder.DrawLate;
        group.userData.__centered = true;
      }
    }
  }

  return (
    <widgetVisual key={key} name={key} {...props}>
      <primitive object={group.clone()} attach='visual' />
    </widgetVisual>
  );
}
