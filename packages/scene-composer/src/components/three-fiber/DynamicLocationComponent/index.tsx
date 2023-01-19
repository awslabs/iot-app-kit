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
    const decoderFunction = propertyDecoders![context.propertyName];
    if (obj && 
      context.propertyName &&
      locationResult[context.propertyName] && 
      !!decoderFunction
    ) {
      const locationString = String(locationResult[context.propertyName]);
      console.log('use location string of: ', locationString);
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
    }
  },[locationResult, valueDataBinding, propertyDecoders]);
  const [transform, restore] = useLocationEffect(updateLocation, entityObject3D);

  /*
  useEffect(() => {
    console.log('propertyDecoders update - function list is: ', JSON.parse(JSON.stringify(propertyDecoders)));
    console.log('propertyDecoders update - function list is: ', propertyDecoders);
  },[propertyDecoders])
  */

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
