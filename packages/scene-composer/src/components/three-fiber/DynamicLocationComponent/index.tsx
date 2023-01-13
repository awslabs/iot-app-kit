import React, { useMemo, useEffect } from 'react';
import { Euler, Object3D, MathUtils } from 'three';
import { isEmpty, values } from 'lodash';

import { ISceneNodeInternal, IDynamicLocationComponentInternal, useStore, useDataStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { dataBindingValuesProvider } from '../../../utils/dataBindingUtils';
import useLocationEffect from '../../../hooks/useLocationEffect';
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

  const { dataBindingTemplate, dataInput } = useDataStore(sceneComposerId);

  const locationResult = useMemo(() => {
    const values: Record<string, any> = dataBindingValuesProvider(dataInput, valueDataBinding!, dataBindingTemplate);
    console.log('location result: ', values);
    return values;
  }, [dataInput, valueDataBinding, dataBindingTemplate]);

  // const [transform, restore] = useMaterialEffect(
  //   /* istanbul ignore next */ (obj) => {
  //     if (obj instanceof Mesh && ruleColor) {
  //       if ('color' in obj.material) {
  //         if (ruleColor) {
  //           if (ruleColor.color) {
  //             obj.material.color = ruleColor.color.clone().convertSRGBToLinear();
  //           }
  //           if ((ruleColor.alpha || ruleColor.alpha === 0) && ruleColor?.alpha !== 1) {
  //             obj.material.transparent = true;
  //             obj.material.opacity = ruleColor.alpha;
  //           }
  //         }
  //       }
  //     }
  //   },
  //   entityObject3D,
  // );

  const [transform, restore] = useLocationEffect((obj: Object3D) => {
    if (obj && locationResult.locationString) {
      const locationString = String(locationResult.locationString);
      const newLocationValues = locationString.split(',');
      if (newLocationValues.length === 6) {
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
      }
    }
  }, entityObject3D);

  useEffect(() => {
    if (!isEmpty(locationResult)) {
      transform();
    }

    return () => restore();
  }, [locationResult, entityObject3D]);

  // This component relies on side effects to update the rendering of the entity's mesh. Returning an empty fragment.
  return <React.Fragment></React.Fragment>;
};

export default DynamicLocationComponent;
