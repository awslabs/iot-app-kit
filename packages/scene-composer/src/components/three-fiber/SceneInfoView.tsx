import { TextContent } from '@cloudscape-design/components';
import { Html } from '@react-three/drei/web/Html';
import { useContext, useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as THREE from 'three';

import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { accessStore } from '../../store';

const SCENE_INFO_VIEW_WIDTH = 140; //in px

const i18nSceneStatsStrings = defineMessages({
  Vertices: {
    defaultMessage: 'Vertices : {sceneInfoVertices, number}',
    description: 'Number of Vertices in a scene',
  },
  Triangles: {
    defaultMessage: 'Triangles : {sceneInfoTriangles, number}',
    description: 'Number of Triangles in a scene',
  },
});

interface ISceneInfo {
  objects: number;
  vertices: number;
  triangles: number;
}

export function SceneInfoView() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  // TODO: This needs to be refactored to store these objects by ref, and have this view redrawn every frame.
  // it creates a performance bottleneck since anytime the geometry changes, we need to update state, and
  // redraw this component, while counting all of the objects in the scene.
  //
  // I have removed the legacy tests that were broken here, since they weren't adding value and this needs to be refactored in a separate update.
  const [sceneInfo, setSceneInfo] = useState<ISceneInfo>({ objects: 0, vertices: 0, triangles: 0 });
  const { formatMessage } = useIntl();

  useEffect(() => {
    return accessStore(sceneComposerId).subscribe((state) => {
      let objects = 0;
      let vertices = 0;
      let triangles = 0;

      Object.keys(state.sceneNodeRefObject3DMapping.getMapping()).forEach((k) => {
        const object = state.sceneNodeRefObject3DMapping.getMapping()[k];

        object.traverseVisible((object) => {
          objects++;

          if (object instanceof THREE.Mesh) {
            const geometry = object.geometry;

            if (geometry.isGeometry) {
              vertices += geometry.vertices.length;
              triangles += geometry.faces.length;
            } else if (geometry.isBufferGeometry) {
              vertices += geometry.attributes.position.count;

              if (geometry.index !== null) {
                triangles += geometry.index.count / 3;
              } else {
                triangles += geometry.attributes.position.count / 3;
              }
            }
          }
        });
      });

      setSceneInfo({
        objects,
        vertices,
        triangles,
      });
    });
  }, [sceneComposerId]);

  return (
    <Html
      calculatePosition={calculatePosition}
      style={{
        width: `${SCENE_INFO_VIEW_WIDTH}px`,
        height: '100px',
        paddingLeft: '16px',
        paddingTop: '8px',
        backgroundColor: 'rgba(10,10,10, 0.2)',
      }}
    >
      <TextContent>
        <p>
          <small>
            <b>{formatMessage({ defaultMessage: 'Scene Statistics', description: 'Title' })}</b>
          </small>
        </p>
      </TextContent>

      <TextContent>
        <p>
          <small>{formatMessage(i18nSceneStatsStrings.Vertices, { sceneInfoVertices: sceneInfo.vertices })}</small>
        </p>
      </TextContent>

      <TextContent>
        <p>
          <small>{formatMessage(i18nSceneStatsStrings.Triangles, { sceneInfoTriangles: sceneInfo.triangles })}</small>
        </p>
      </TextContent>
    </Html>
  );
}

//Use three.js lerpVectors function to handle the interpolation calculation.
//We only need one dimension but have to provide 3 for three.js to be satisfied,
// so we are ignoring y and z dimensions.
const interpolateBetween = (point1: number, point2: number, factor: number) => {
  const firstPoint = new THREE.Vector3(point1, 0, 0);
  const secondPoint = new THREE.Vector3(point2, 0, 0);
  const lerpPoint = new THREE.Vector3();

  return lerpPoint.lerpVectors(firstPoint, secondPoint, factor).x;
};

//For wide screens (> 600px wide), position the scene info 300px away from the right edge of the scene.
//For small screens (< 300px wide), position the scene info right against the edge of the scene
//For screens in between, use a linear interpolation to smooth out the transition
function calculatePosition(
  _el: THREE.Object3D,
  _camera: THREE.Camera,
  size: { width: number; height: number },
): number[] {
  const wideScreenWidthPixels = 600;
  const compactScreenWidthPixels = 300;

  const standardHorizontalDisplacementPixels = 300;
  const compactHorizontalDisplacementPixels = SCENE_INFO_VIEW_WIDTH;
  const standardVerticleDisplacementPixels = 120;

  const standardHorizontalPosition = size.width - standardHorizontalDisplacementPixels;
  const compactHorizontalPosition = size.width - compactHorizontalDisplacementPixels;
  const standardVerticlePosition = size.height - standardVerticleDisplacementPixels;

  if (size.width > wideScreenWidthPixels) {
    return [standardHorizontalPosition, standardVerticlePosition];
  } else if (size.width > compactScreenWidthPixels) {
    const interpolationFactor =
      (size.width - compactScreenWidthPixels) / (wideScreenWidthPixels - compactScreenWidthPixels);

    return [
      size.width -
        interpolateBetween(
          compactHorizontalDisplacementPixels,
          standardHorizontalDisplacementPixels,
          interpolationFactor,
        ),
      standardVerticlePosition,
    ];
  } else {
    return [compactHorizontalPosition, standardVerticlePosition];
  }
}
