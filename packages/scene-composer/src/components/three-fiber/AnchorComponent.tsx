import React, { useContext } from 'react';

import { AnchorWidget } from '../../augmentations/components/three-fiber/anchor/AnchorWidget';
import { ISceneNodeInternal, IAnchorComponentInternal, useStore } from '../../store';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { getComponentGroupName } from '../../utils/objectThreeUtils';
import { DefaultAnchorStatus } from '../../interfaces';

interface IAnchorComponentProps {
  node: ISceneNodeInternal;
  component: IAnchorComponentInternal;
}

export const AnchorComponent: React.FC<IAnchorComponentProps> = ({ node, component }: IAnchorComponentProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const rule = useStore(sceneComposerId)((state) => state.getSceneRuleMapById(component.ruleBasedMapId));

  return (
    <group name={getComponentGroupName(node.ref, 'TAG')}>
      <AnchorWidget
        node={node}
        defaultIcon={component.icon ?? DefaultAnchorStatus.Info}
        navLink={component.navLink}
        rule={rule}
        valueDataBinding={component.valueDataBinding}
      />
    </group>
  );
};
