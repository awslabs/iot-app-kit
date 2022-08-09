import React, { useRef, useMemo, useEffect } from 'react';
import { Mesh } from 'three';
import { isEmpty } from 'lodash';

import { SceneResourceType } from '../../../interfaces';
import { ISceneNodeInternal, IColorOverlayComponentInternal, useStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { getComponentsGroupName } from '../../../utils/objectThreeUtils';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../utils/dataBindingUtils';
import { getSceneResourceInfo, parseColorWithAlpha } from '../../../utils/sceneResourceUtils';

interface IColorOverlayComponentProps {
  node: ISceneNodeInternal;
  component: IColorOverlayComponentInternal;
}

const ColorOverlayComponent: React.FC<IColorOverlayComponentProps> = ({
  node,
  component,
}: IColorOverlayComponentProps) => {
  const sceneComposerId = useSceneComposerId();
  const rule = useStore(sceneComposerId)((state) => state.getSceneRuleMapById(component.ruleBasedMapId));
  const dataInput = useStore(sceneComposerId)((state) => state.dataInput);
  const entityObject3D = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef(node.ref));
  const dataBindingTemplate = useStore(sceneComposerId)((state) => state.dataBindingTemplate);
  const originalMaterialMap = useRef({});

  const visualState = useMemo(() => {
    const values: Record<string, any> = dataBindingValuesProvider(
      dataInput,
      component.valueDataBinding,
      dataBindingTemplate,
    );
    const result = ruleEvaluator('', values, rule);
    const ruleTargetInfo = getSceneResourceInfo(result as string);
    // Color overlay widget only accepts color, otherwise, default to undefined
    return ruleTargetInfo.type === SceneResourceType.Color ? parseColorWithAlpha(ruleTargetInfo.value) : undefined;
  }, [rule, dataInput, component.valueDataBinding]);

  useEffect(() => {
    if (entityObject3D) {
      // Save original material
      if (isEmpty(originalMaterialMap.current)) {
        entityObject3D.getObjectByName(getComponentsGroupName(node.ref))?.traverse((obj) => {
          if (obj instanceof Mesh && 'color' in obj.material) {
            if (!originalMaterialMap.current[obj.uuid]) {
              originalMaterialMap.current[obj.uuid] = {
                color: obj.material.color,
                transparent: obj.material.transparent,
                opacity: obj.material.opacity,
              };
            }
          }
        });
      }

      // override mesh material
      entityObject3D.getObjectByName(getComponentsGroupName(node.ref))?.traverse((obj) => {
        if (obj instanceof Mesh) {
          if ('color' in obj.material) {
            obj.material.color = visualState
              ? visualState.color.clone().convertSRGBToLinear()
              : originalMaterialMap.current[obj.uuid]?.color;
            if (visualState?.alpha && visualState?.alpha !== 1) {
              obj.material.transparent = true;
              obj.material.opacity = visualState.alpha;
            }
          }
        }
      });

      return () => {
        // restore original material setting
        entityObject3D.getObjectByName(getComponentsGroupName(node.ref))?.traverse((obj) => {
          if (obj instanceof Mesh && originalMaterialMap.current[obj.uuid]) {
            obj.material.color = originalMaterialMap.current[obj.uuid].color;
            obj.material.transparent = originalMaterialMap.current[obj.uuid].transparent;
            obj.material.opacity = originalMaterialMap.current[obj.uuid].opacity;
          }
        });
      };
    }
  }, [entityObject3D, visualState]);

  // This component relies on side effects to update the rendering of the entity's mesh. Returning an empty fragment.
  return <React.Fragment></React.Fragment>;
};

export default ColorOverlayComponent;
