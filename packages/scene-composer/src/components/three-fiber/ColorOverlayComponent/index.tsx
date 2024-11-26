import isEmpty from 'lodash-es/isEmpty';
import { useEffect, useMemo } from 'react';
import { type Material, Mesh } from 'three';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import useMaterialEffect from '../../../hooks/useMaterialEffect';
import useRuleResult from '../../../hooks/useRuleResult';
import { SceneResourceType } from '../../../interfaces';
import { type IColorOverlayComponentInternal, type ISceneNodeInternal, accessStore } from '../../../store';
import { getSceneResourceInfo, parseColorWithAlpha } from '../../../utils/sceneResourceUtils';

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
  const entityObject3D = accessStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef(node.ref));

  const ruleResult = useRuleResult({ ruleMapId: ruleBasedMapId, dataBinding: valueDataBinding });

  const ruleColor = useMemo(() => {
    const { type, value } = getSceneResourceInfo(ruleResult.target as string);

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
    // @ts-expect-error type mismatch after upgrade
    /* istanbul ignore next */ (obj) => {
      if (obj instanceof Mesh && ruleColor) {
        const newMaterial: Material = obj.material.clone();
        if ('color' in newMaterial) {
          if (ruleColor) {
            if (ruleColor.color) {
              newMaterial.color = ruleColor.color.clone().convertSRGBToLinear();
            }
            if ((ruleColor.alpha || ruleColor.alpha === 0) && ruleColor?.alpha !== 1) {
              newMaterial.transparent = true;
              newMaterial.opacity = ruleColor.alpha;
            }
            return newMaterial;
          }
        }
      }
      return null;
    },
    'rules',
    entityObject3D,
  );

  useEffect(() => {
    if (!isEmpty(ruleResult)) {
      transform();
    }

    return () => {
      restore();
    };
  }, [ruleResult, entityObject3D]);

  // This component relies on side effects to update the rendering of the entity's mesh. Returning an empty fragment.
  return <></>;
};

export default ColorOverlayComponent;
