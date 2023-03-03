import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as _ from 'lodash';
import shallow from 'zustand/shallow';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { IModelRefComponentInternal, ISceneNodeInternal, RootState, useStore } from '../../../store';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { IDataFrame, IDataInput, KnownSceneProperty } from '../../../interfaces';
import { TwinMakerGLTFLoader } from '../../../three/GLTFLoader';
import { setupTwinMakerGLTFLoader } from '../../../three/loaderUtils';
import { URIModifier } from '../../../interfaces/interfaces';
import { ColladaLoader } from '../../../three/ColladaLoader';
import { STLLoader } from '../../../three/STLLoader';
import URDFLoader from '../../../three/URDFLoader';
import { URDFRobot } from '../../../three/URDFClasses';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { TwinMakerFileLoader } from '../../../three/TwinMakerFileLoader';

export function useURDF(
  path: string,
  uriModifier?: URIModifier,
  onProgress?: (event: ProgressEvent<EventTarget>) => void,
) {
  const urdf = useLoader(
    URDFLoader as any,
    path,
    (loader) => {
      if (!loader.manager) {
        loader.manager = THREE.DefaultLoadingManager;
      }

      const globalSettings = getGlobalSettings();

      if (globalSettings.getSceneObjectFunction) {
        const fileLoader = new TwinMakerFileLoader(loader.manager);
        fileLoader.setGetSceneObjectFunction(globalSettings.getSceneObjectFunction);
        (loader as URDFLoader).setFileLoader(fileLoader);
      }

      if (uriModifier) loader.manager.setURLModifier(uriModifier);

      // remove filename part from path
      const idx = path.lastIndexOf('/');
      if (idx !== -1) {
        path = path.substring(0, idx);
      }

      // @ts-ignore
      loader.loadMeshCb = function (localPath, manager, onComplete) {
        const resourcePath = path + localPath;

        const errorHandler = (err) => {
          onComplete(null, err);
        };

        if (localPath.toLowerCase().endsWith('.obj')) {
          const loader = new OBJLoader(manager);
          loader.load(
            resourcePath,
            (result) => {
              onComplete(result);
            },
            undefined,
            errorHandler,
          );
        } else if (localPath.toLowerCase().endsWith('.stl')) {
          const loader = new STLLoader(manager);

          const globalSettings = getGlobalSettings();

          if (globalSettings.getSceneObjectFunction) {
            const fileLoader = new TwinMakerFileLoader(loader.manager);
            fileLoader.setGetSceneObjectFunction(globalSettings.getSceneObjectFunction);
            loader.setFileLoader(fileLoader);
          }

          if (uriModifier) loader.manager.setURLModifier(uriModifier);

          loader.load(
            resourcePath,
            (result) => {
              const mesh = new THREE.Mesh(
                result,
                new THREE.MeshPhongMaterial({ color: 0xaaaaaa, specular: 0x111111, shininess: 200 }),
              );
              onComplete(mesh);
            },
            undefined,
            errorHandler,
          );
        } else if (localPath.toLowerCase().endsWith('.dae')) {
          const loader = new ColladaLoader(manager);
          const globalSettings = getGlobalSettings();

          if (globalSettings.getSceneObjectFunction) {
            const fileLoader = new TwinMakerFileLoader(loader.manager);
            fileLoader.setGetSceneObjectFunction(globalSettings.getSceneObjectFunction);
            loader.setFileLoader(fileLoader);
          }

          if (uriModifier) loader.manager.setURLModifier(uriModifier);

          loader.load(
            resourcePath,
            (result) => {
              onComplete(result.scene);
            },
            undefined,
            errorHandler,
          );
        }
      };
    },
    onProgress,
  );
  return urdf;
}

interface URDFModelProps {
  node: ISceneNodeInternal;
  component: IModelRefComponentInternal;
}

export const URDFModelComponent: React.FC<URDFModelProps> = ({ node, component }: URDFModelProps) => {
  const sceneComposerId = useSceneComposerId();
  const log = useLifecycleLogging('URDFModelComponent');

  const uriModifier = useStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);

  // hack: add data binding context to the component
  const { valueDataBinding } = component as any;

  const { entityId, propertyName, componentName } = valueDataBinding?.dataBindingContext as any;

  // TODO: improve data binding mechanism
  const dataFramePattern = `"componentName":"${componentName}","entityId":"${entityId}","propertyName":"${propertyName}"`;

  // TODO: tilesRenderer holds "group" and it'll load tiles and B3DM/I3DM files dynanimcally, so we don't need
  //       to clone the model like what we did in GLTFModelComponent. However, if we found this assumption is
  //       wrong in the future, let's optimize from here.
  const urdf = useURDF(component.uri, uriModifier, (e) => console.log('urdf load progress', e)) as URDFRobot;

  // load and replay joint states from SiteWise
  useEffect(() => {
    if (urdf) {
      console.log('loaded urdf with joints', urdf.joints);

      // reset the initial state
      console.log('reset the robot to its initial state');
      const initState: any = {};
      for (const k in urdf.joints) {
        const joint = urdf.joints[k];
        // reset to 0
        initState[joint.name] = 0;
      }
    }

    let currentCursorIndex = 0;

    // subscribe to data changes
    const unsub = useStore(sceneComposerId).subscribe(
      (
        state: {
          dataInput?: IDataInput;
          playbackCursor?: number;
        },
        old,
      ) => {
        // console.log('>> playbackCursor', state.playbackCursor);

        const robotState = state.dataInput?.dataFrames?.filter(
          (f) => f.dataFrameId.indexOf(dataFramePattern) !== -1,
        )?.[0];
        const timeValues = robotState?.fields[0].values;

        if (timeValues && state.dataInput?.timeRange && state.playbackCursor !== undefined) {
          if (state.playbackCursor === 0) {
            currentCursorIndex = 0;
          }

          const playbackTimestamp = state.dataInput.timeRange.from + state.playbackCursor;
          if (timeValues[currentCursorIndex] < playbackTimestamp) {
            currentCursorIndex += 1;
          }

          if (currentCursorIndex >= timeValues.length) {
            currentCursorIndex = timeValues.length - 1;
          }

          // TODO: find field based on name instead of index
          const poseValues = robotState?.fields[1].values.map((v) => JSON.parse(v));
          // console.log('poseValues', poseValues);
          // console.log('currentCursorIndex', currentCursorIndex);

          if (poseValues && poseValues.length > currentCursorIndex) {
            const jointValues = poseValues[currentCursorIndex].jointValues;

            urdf.setJointValues(jointValues);
          }
        }
      },
      (state) => ({
        playbackCursor: state.playbackCursor,
        dataInput: state.dataInput,
      }),
      shallow,
    );
    return () => {
      unsub();
    };
  }, [urdf]);

  return (
    <group name={getComponentGroupName(node.ref, 'URDF_MODEL')} dispose={null}>
      <primitive object={urdf} />
    </group>
  );
};
