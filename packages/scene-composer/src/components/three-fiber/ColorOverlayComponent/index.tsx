import React, { useRef, useMemo, useEffect } from 'react';
import { Mesh } from 'three';

import { SceneResourceType } from '../../../interfaces';
import { ISceneNodeInternal, IColorOverlayComponentInternal, useStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../utils/dataBindingUtils';
import { getSceneResourceInfo, parseColorWithAlpha } from '../../../utils/sceneResourceUtils';
import useMaterialEffect from '../../../hooks/useMaterialEffect';

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

  const ruleResult = useMemo(() => {
    const values: Record<string, any> = dataBindingValuesProvider(
      dataInput,
      component.valueDataBinding,
      dataBindingTemplate,
    );
    return ruleEvaluator('', values, rule);
  }, [rule, dataInput, component.valueDataBinding]);

  const visualState = useMemo(() => {
    const ruleTargetInfo = getSceneResourceInfo(ruleResult as string);
    // Color overlay widget only accepts color, otherwise, default to undefined
    return ruleTargetInfo.type === SceneResourceType.Color ? parseColorWithAlpha(ruleTargetInfo.value) : undefined;
  }, [rule, dataInput, component.valueDataBinding]);

  const [transform, restore] = useMaterialEffect(
    /* istanbul ignore next */ (obj) => {
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
    },
    entityObject3D,
  );

  useEffect(() => {
    if (ruleResult !== '') {
      transform();
    }
  }, [ruleResult, visualState, entityObject3D]);

  useEffect(() => {
    return () => {
      restore();
    };
  }, []);

  // This component relies on side effects to update the rendering of the entity's mesh. Returning an empty fragment.
  return <React.Fragment></React.Fragment>;
};

export default ColorOverlayComponent;
