import React from 'react';

import { AnchorWidget } from '../../../augmentations/components/three-fiber/anchor/AnchorWidget';
import { ISceneNodeInternal, IAnchorComponentInternal } from '../../../store';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';
import { DefaultAnchorStatus } from '../../../interfaces';

interface IAnchorComponentProps {
  node: ISceneNodeInternal;
  component: IAnchorComponentInternal;
}

const AnchorComponent: React.FC<IAnchorComponentProps> = ({ node, component }: IAnchorComponentProps) => {
  return (
    <group name={getComponentGroupName(node.ref, 'TAG')}>
      <AnchorWidget
        node={node}
        defaultIcon={component.icon ?? DefaultAnchorStatus.Info}
        navLink={component.navLink}
        ruleBasedMapId={component.ruleBasedMapId}
        valueDataBinding={component.valueDataBinding}
        chosenColor={component.chosenColor}
      />
    </group>
  );
};

export default AnchorComponent;
