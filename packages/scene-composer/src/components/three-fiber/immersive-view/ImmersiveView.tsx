import React, { ReactNode, useContext, useEffect, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Mesh } from 'three';
import { IntlProvider } from 'react-intl';
import { DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';

import useLogger from '../../../logger/react-logger/hooks/useLogger';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IViewpointComponentInternal, useEditorState, useSceneDocument } from '../../../store';
import { KnownComponentType } from '../../../interfaces';
import { findComponentByType } from '../../../utils/nodeUtils';
import { LoadingProgress } from '../LoadingProgress';
import usePreloadSkyboxImages from '../../../hooks/usePreloadSkyboxImages';
import { getGlobalSettings } from '../../../common/GlobalSettings';

import { generateCubeMapSkyboxTexture, generateSixSidedSkyboxTexture } from './ImmersiveViewUtils';

export const generateEquirectangularSkyboxTexture = (image: string, renderer: THREE.WebGLRenderer): THREE.Texture => {
  // TODO: Not working yet, need to fix, and then update to use TwinMakerTextureLoader
  const texture: THREE.Texture = useLoader(THREE.TextureLoader, image);
  const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
  renderTarget.fromEquirectangularTexture(renderer, texture);
  return renderTarget.texture;
};

export const createMaterialNodes = (textures: THREE.Texture[]): ReactNode[] => {
  const materials: ReactNode[] = [];

  textures.forEach((texture, index) => {
    materials.push(<meshBasicMaterial key={index} map={texture} attachArray={'material'} side={THREE.BackSide} />);
  });

  return materials;
};

export const createMaterial = (texture: THREE.Texture): ReactNode => {
  // TODO: In the case of using an actual box geometry vs the scene background we have an issue loading
  //  equirectangular images. The outside of the box is mapped correctly but looking at it
  //  from the inside has the x, y, and z images flipped
  //  https://sim.amazon.com/issues/IOTROCI-5883
  return <meshBasicMaterial envMap={texture} side={THREE.BackSide} />;
};

export function ImmersiveView() {
  const log = useLogger('ImmersiveView');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { cameraControlsType, selectedViewpointNodeRef, getObject3DBySceneNodeRef, isInViewpointTransition } =
    useEditorState(sceneComposerId);
  const { getSceneNodeByRef } = useSceneDocument(sceneComposerId);

  const { gl, camera } = useThree();
  const renderer = gl;
  const node = getSceneNodeByRef(selectedViewpointNodeRef);
  const viewpointComponent = useMemo(() => {
    return findComponentByType(node, KnownComponentType.Viewpoint) as IViewpointComponentInternal;
  }, [node, selectedViewpointNodeRef]);

  const [textureFormat, setTextureFormat] = useState<string>();
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);
  const [viewpointPosition, setViewpointPosition] = useState<THREE.Vector3>();
  const [viewpointRotation, setViewpointRotation] = useState<THREE.Vector3>();
  const [isReady, setIsReady] = useState<boolean>(false);

  const [shouldUpdateUV, setShouldUpdateUV] = useState<boolean>(true);

  const meshRef = useRef<Mesh>();

  usePreloadSkyboxImages();

  useEffect(() => {
    if (cameraControlsType === 'immersive' && viewpointComponent) {
      // Create Skybox texture and set to scene background.
      setTextureFormat(viewpointComponent.skyboxImageFormat);
      setIsReady(viewpointComponent?.skyboxImages.some((image) => THREE.Cache.get(image)));

      // Update position
      const viewpointObject = getObject3DBySceneNodeRef(node?.ref);

      const cameraPosition = new THREE.Vector3(
        viewpointComponent.cameraPosition[0],
        viewpointComponent.cameraPosition[1],
        viewpointComponent.cameraPosition[2],
      );

      const cameraRotation = viewpointComponent.cameraRotation
        ? new THREE.Vector3(
            viewpointComponent.cameraRotation[0],
            viewpointComponent.cameraRotation[1],
            viewpointComponent.cameraRotation[2],
          )
        : new THREE.Vector3(0, 0, 0);

      const position = cameraPosition;
      const rotation = cameraRotation;
      let parent: THREE.Object3D | null = viewpointObject?.parent || null;
      while (parent) {
        position.add(parent.position);
        rotation.add(parent.rotation.toVector3());
        parent = parent.parent;
      }

      setViewpointPosition(position);
      setViewpointRotation(rotation);

      switch (viewpointComponent.skyboxImageFormat) {
        case 'SixSided':
          generateSixSidedSkyboxTexture(viewpointComponent.skyboxImages, setTextures).finally(() => {
            setIsReady(true);
          });
          break;
        case 'CubeMap':
          generateCubeMapSkyboxTexture(viewpointComponent.skyboxImages[0], setTextures).finally(() => {
            setIsReady(true);
          });
          break;
        case 'Equirectangular':
          setTextures([generateEquirectangularSkyboxTexture(viewpointComponent.skyboxImages[0], renderer)]);
          break;
        default:
          setTextures(null);
          break;
      }
    } else {
      setTextures(null);
    }
  }, [viewpointComponent, cameraControlsType]);

  useEffect(() => {
    setShouldUpdateUV(true);
  }, [cameraControlsType, selectedViewpointNodeRef]);

  useFrame(() => {
    // recalculate uv mapping to solve seam on the edge issue
    // https://sim.amazon.com/IOTROCI-6327
    const offsetParameter = 0.005;
    if (meshRef.current?.geometry && shouldUpdateUV) {
      setShouldUpdateUV(false);
      const oldUvMapping = meshRef.current.geometry.attributes.uv;
      const newUvMapping: number[] = [];
      for (let i = 0; i < oldUvMapping.array.length; i++) {
        const offset =
          oldUvMapping.array[i] === 0
            ? offsetParameter
            : oldUvMapping.array[i] === 1
            ? 1 - offsetParameter
            : oldUvMapping.array[i];

        newUvMapping.push(offset);
      }

      meshRef.current.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(newUvMapping, 2));
    }
  });

  const size = camera.far;

  const render = () => {
    if (cameraControlsType === 'immersive') {
      if (!isReady) {
        return (
          <IntlProvider locale={getGlobalSettings().locale}>
            <LoadingProgress />
          </IntlProvider>
        );
      } else if (isReady && textures) {
        return (
          <>
            <mesh
              ref={meshRef}
              type={'Skybox'}
              renderOrder={-1}
              position={viewpointPosition ? [viewpointPosition.x, viewpointPosition.y, viewpointPosition.z] : [0, 0, 0]}
              rotation={viewpointRotation ? [viewpointRotation.x, viewpointRotation.y, viewpointRotation.z] : [0, 0, 0]}
            >
              <boxGeometry args={[size, size, size]} />
              {textureFormat === 'Equirectangular' ? createMaterial(textures[0]) : createMaterialNodes(textures)}
            </mesh>
            {isInViewpointTransition && (
              <EffectComposer>
                <DepthOfField focusDistance={1} focalLength={0.02} bokehScale={7} height={480} />
                <Vignette offset={0.5} />
              </EffectComposer>
            )}
          </>
        );
      }
    }

    return null;
  };

  return <>{render()}</>;
}
