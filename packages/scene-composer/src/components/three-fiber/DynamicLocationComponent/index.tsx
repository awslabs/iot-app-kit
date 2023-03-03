import React, { useMemo, useEffect, useCallback } from 'react';
import { Euler, Object3D, MathUtils, Vector3, Quaternion } from 'three';
import { isEmpty, values } from 'lodash';
import shallow from 'zustand/shallow';

import { ISceneNodeInternal, IDynamicLocationComponentInternal, useStore, useDataStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { dataBindingValuesProvider, containsMatchingEntityComponent } from '../../../utils/dataBindingUtils';
import useLocationEffect from '../../../hooks/useLocationEffect';
import { IDataInput } from '../../../interfaces';

interface IDynanamicLocationComponentProps {
  node: ISceneNodeInternal;
  component: IDynamicLocationComponentInternal;
}

const DynamicLocationComponent: React.FC<IDynanamicLocationComponentProps> = ({
  node,
  component,
}: IDynanamicLocationComponentProps) => {
  const { valueDataBinding } = component;
  const sceneComposerId = useSceneComposerId();
  const entityObject3D = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef(node.ref));

  const { dataBindingTemplate, dataInput, propertyDecoders } = useDataStore(sceneComposerId);

  const { entityId, propertyName, componentName } = valueDataBinding?.dataBindingContext as any;

  // TODO: improve data binding mechanism
  const dataFramePattern = `"componentName":"${componentName}","entityId":"${entityId}","propertyName":"${propertyName}"`;

  // const locationResult = useMemo(() => {
  //   const values: Record<string, any> = dataBindingValuesProvider(dataInput, valueDataBinding!, dataBindingTemplate);
  //   console.log('location result: ', values);
  //   return values;
  // }, [dataInput, valueDataBinding, dataBindingTemplate]);

  // const updateLocation = useCallback(
  //   (obj: Object3D) => {
  //     const context = valueDataBinding?.dataBindingContext as any;
  //     const decoderFunction = propertyDecoders![context.propertyName];
  //     if (obj && context.propertyName && locationResult[context.propertyName] && !!decoderFunction) {
  //       const locationString = String(locationResult[context.propertyName]);
  //       console.log('use location string of: ', locationString);
  //       const newLocation = decoderFunction(locationString);
  //       obj.position.x = newLocation.positionX;
  //       obj.position.y = newLocation.positionY;
  //       obj.position.z = newLocation.positionZ;
  //       obj.setRotationFromEuler(
  //         new Euler(
  //           MathUtils.degToRad(newLocation.rotationDegX),
  //           MathUtils.degToRad(newLocation.rotationDegY),
  //           MathUtils.degToRad(newLocation.rotationDegZ),
  //         ),
  //       );
  //     }
  //   },
  //   [locationResult, valueDataBinding, propertyDecoders],
  // );

  // load and replay states from SiteWise
  useEffect(() => {
    let currentCursorIndex = 0;

    if (entityObject3D) {
      // subscribe to data changes
      const unsub = useStore(sceneComposerId).subscribe(
        (
          state: {
            dataInput?: IDataInput;
            playbackCursor?: number;
          },
          old,
        ) => {
          // console.log('>> playbackCursor in dynamic location', state.playbackCursor);

          const pose = state.dataInput?.dataFrames?.filter((f) => f.dataFrameId.indexOf(dataFramePattern) !== -1)?.[0];
          const timeValues = pose?.fields[0].values;

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
            const poseValues = pose?.fields[1].values.map((v) => JSON.parse(v));
            // console.log('poseValues', poseValues);
            // console.log('currentCursorIndex', currentCursorIndex);

            if (poseValues && poseValues.length > currentCursorIndex) {
              const currentPose = poseValues[currentCursorIndex];
              // console.log('current pose', currentPose);

              // convert left-handed to right-handed
              const position = new Vector3(-currentPose.position.x, currentPose.position.y, currentPose.position.z);
              const q = new Quaternion(
                -currentPose.orientation.x,
                currentPose.orientation.y,
                currentPose.orientation.z,
                -currentPose.orientation.w,
              );
              const v = new Euler();
              v.setFromQuaternion(q);
              v.y += Math.PI;
              v.z *= -1;

              entityObject3D.position.copy(position);
              entityObject3D.rotation.copy(v);
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
    }
  }, [entityObject3D]);

  // This component relies on side effects to update the rendering of the entity's mesh. Returning an empty fragment.
  return <React.Fragment></React.Fragment>;
};

export default DynamicLocationComponent;
