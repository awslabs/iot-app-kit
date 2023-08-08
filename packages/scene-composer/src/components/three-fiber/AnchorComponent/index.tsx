import React from 'react';

import { AnchorWidget } from '../../../augmentations/components/three-fiber/anchor/AnchorWidget';
import { ISceneNodeInternal, IAnchorComponentInternal, useStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';
import { DefaultAnchorStatus } from '../../../interfaces';

interface IAnchorComponentProps {
  node: ISceneNodeInternal;
  component: IAnchorComponentInternal;
}

const AnchorComponent: React.FC<IAnchorComponentProps> = ({ node, component }: IAnchorComponentProps) => {
  const sceneComposerId = useSceneComposerId();
  const rule = useStore(sceneComposerId)((state) => state.getSceneRuleMapById(component.ruleBasedMapId));
  console.log({ rule });
  return (
    <group name={getComponentGroupName(node.ref, 'TAG')}>
      <AnchorWidget
        node={node}
        defaultIcon={component.icon ?? DefaultAnchorStatus.Info}
        navLink={component.navLink}
        rule={rule}
        valueDataBinding={component.valueDataBinding}
        chosenColor={component.chosenColor}
      />
    </group>
  );
};

export default AnchorComponent;
