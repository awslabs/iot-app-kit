import { Html } from '@react-three/drei/web/Html';
import React, { useContext, useEffect, useState } from 'react';
import { TextContent } from '@awsui/components-react';
import { useIntl, defineMessages } from 'react-intl';
import * as THREE from 'three';

import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useStore } from '../../store';

interface ISceneInfo {
  objects: number;
  vertices: number;
  triangles: number;
}

export function SceneInfoView() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const [sceneInfo, setSceneInfo] = useState<ISceneInfo>({ objects: 0, vertices: 0, triangles: 0 });
  const intl = useIntl();
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

  useEffect(() => {
    return useStore(sceneComposerId).subscribe((state) => {
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
        width: '160px',
        height: '100px',
        paddingLeft: '16px',
        paddingTop: '8px',
        backgroundColor: 'rgba(10,10,10, 0.2)',
      }}
    >
      <TextContent>
        <p>
          <small>
            <b>{intl.formatMessage({ defaultMessage: 'Scene Statistics', description: 'Title' })}</b>
          </small>
        </p>
      </TextContent>

      <TextContent>
        <p>
          <small>{intl.formatMessage(i18nSceneStatsStrings.Vertices, { sceneInfoVertices: sceneInfo.vertices })}</small>
        </p>
      </TextContent>

      <TextContent>
        <p>
          <small>
            {intl.formatMessage(i18nSceneStatsStrings.Triangles, { sceneInfoTriangles: sceneInfo.triangles })}
          </small>
        </p>
      </TextContent>
    </Html>
  );
}

function calculatePosition(
  el: THREE.Object3D,
  camera: THREE.Camera,
  size: { width: number; height: number },
): number[] {
  return [20, size.height - 120];
}
