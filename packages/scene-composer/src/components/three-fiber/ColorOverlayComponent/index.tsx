import React, { useMemo, useEffect } from 'react';
import { Mesh } from 'three';

import { COMPOSER_FEATURES, SceneResourceType } from '../../../interfaces';
import { ISceneNodeInternal, IColorOverlayComponentInternal, useStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { getSceneResourceInfo, parseColorWithAlpha } from '../../../utils/sceneResourceUtils';
import useMaterialEffect from '../../../hooks/useMaterialEffect';
import useRuleResult from '../../../hooks/useRuleResult';
import useFeature from '../../../hooks/useFeature';

interface IColorOverlayComponentProps {
  node: ISceneNodeInternal;
  component: IColorOverlayComponentInternal;
}

const ColorOverlayComponent: React.FC<IColorOverlayComponentProps> = ({
  node,
  component,
}: IColorOverlayComponentProps) => {
  const { ruleBasedMapId, valueDataBinding } = component;
  const sceneComposerId = useSceneComposerId();
  const entityObject3D = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef(node.ref));
  const [{ variation: opacityRuleEnabled }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.OpacityRule]);

  const ruleResult = useRuleResult(ruleBasedMapId!, valueDataBinding!);

  const ruleColor = useMemo(() => {
    const { type, value } = getSceneResourceInfo(ruleResult as string);

    switch (type) {
      case SceneResourceType.Color:
        return parseColorWithAlpha(value);
      case SceneResourceType.Opacity:
        return {
          alpha: Number(value),
        };
      default:
        return undefined;
    }
  }, [ruleResult]);

  const [transform, restore] = useMaterialEffect(
    /* istanbul ignore next */ (obj) => {
      if (obj instanceof Mesh && ruleColor) {
        if ('color' in obj.material) {
          if (ruleColor?.color) {
            obj.material.color = ruleColor.color.clone().convertSRGBToLinear();
          }
          if (ruleColor?.alpha && ruleColor?.alpha !== 1) {
            obj.material.transparent = true;
            obj.material.opacity = ruleColor.alpha;
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

    return () => restore();
  }, [ruleResult, entityObject3D, opacityRuleEnabled]);

  // This component relies on side effects to update the rendering of the entity's mesh. Returning an empty fragment.
  return <React.Fragment></React.Fragment>;
};

export default ColorOverlayComponent;
