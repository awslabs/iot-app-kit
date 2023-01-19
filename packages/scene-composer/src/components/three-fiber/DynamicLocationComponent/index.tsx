import React, { useMemo, useEffect } from 'react';
import { Euler, Object3D, MathUtils } from 'three';
import { isEmpty, values } from 'lodash';

import { ISceneNodeInternal, IDynamicLocationComponentInternal, useStore, useDataStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { dataBindingValuesProvider } from '../../../utils/dataBindingUtils';
import useLocationEffect from '../../../hooks/useLocationEffect';
import { ILocationData } from '../../../interfaces';
import { useCallback } from 'react';
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
  //console.log('function list in main component: ', JSON.parse(JSON.stringify(propertyDecoders)));

  const locationResult = useMemo(() => {
    const values: Record<string, any> = dataBindingValuesProvider(dataInput, valueDataBinding!, dataBindingTemplate);
    console.log('location result: ', values);
    return values;
  }, [dataInput, valueDataBinding, dataBindingTemplate]);

  const updateLocation = useCallback((obj: Object3D) => {
    const context = valueDataBinding?.dataBindingContext as any;
    console.log('context: ', context);
    console.log('can we parse?');
    //const decoderFunction = propertyDecoders![context.propertyDecoders];
    const decoderFunction = propertyDecoders;
    console.log('function list is: ', !!propertyDecoders);
    console.log('function is: ', !!decoderFunction);
    if (obj && 
      context.propertyName &&
      locationResult[context.propertyName] && 
      !!propertyDecoders &&
      !!decoderFunction
    ) {
      console.log('we can');
      const locationString = String(locationResult[context.propertyName]);
      console.log('use location string of: ', locationString);
      //const decoderFunction = propertyDecoders![context.propertyDecoders];
      const newLocation = decoderFunction(locationString);
      obj.position.x = newLocation.positionX;
      obj.position.y = newLocation.positionY;
      obj.position.z = newLocation.positionZ;
      obj.setRotationFromEuler(
        new Euler(
          MathUtils.degToRad(newLocation.rotationDegX),
          MathUtils.degToRad(newLocation.rotationDegY),
          MathUtils.degToRad(newLocation.rotationDegZ),
        ),
      );
      //const locationString = String(locationResult.locationString);
      //const newLocationValues = locationString.split(',');
      /*if (newLocationValues.length === 6) {
        console.log('valid location string');
        obj.position.x = Number(newLocationValues[0]);
        obj.position.y = Number(newLocationValues[1]);
        obj.position.z = Number(newLocationValues[2]);
        obj.setRotationFromEuler(
          new Euler(
            MathUtils.degToRad(Number(newLocationValues[3])),
            MathUtils.degToRad(Number(newLocationValues[4])),
            MathUtils.degToRad(Number(newLocationValues[5])),
          ),
        );
      }*/

    }
  },[locationResult, valueDataBinding, propertyDecoders]);
  const [transform, restore] = useLocationEffect(updateLocation, entityObject3D);

  useEffect(() => {
    if (!isEmpty(locationResult)) {
      transform();
    }

    return () => restore();
  }, [propertyDecoders, locationResult, entityObject3D]);

  // This component relies on side effects to update the rendering of the entity's mesh. Returning an empty fragment.
  return <React.Fragment></React.Fragment>;
};

export default DynamicLocationComponent;
