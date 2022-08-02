import React from 'react';

import { ViewpointWidget } from '../../../augmentations/components/three-fiber/viewpoint/ViewpointWidget';
import { ISceneNodeInternal } from '../../../store';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';

interface IViewpointComponentProps {
  node: ISceneNodeInternal;
}

const ViewpointComponent: React.FC<IViewpointComponentProps> = ({ node }: IViewpointComponentProps) => {
  return (
    <group name={getComponentGroupName(node.ref, 'VIEWPOINT')}>
      <ViewpointWidget node={node} />
    </group>
  );
};

export default ViewpointComponent;
