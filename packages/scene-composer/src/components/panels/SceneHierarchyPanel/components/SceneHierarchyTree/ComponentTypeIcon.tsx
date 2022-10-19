import React from 'react';
import { Icon } from '@awsui/components-react';

import { Camera, Light, Modelref, Tag } from '../../../../../assets/auto-gen/icons';
import { KnownComponentType } from '../../../../../interfaces';

const ComponentTypeIcon = ({ type, ...props }: { type: string }) => {
  switch (type) {
    case KnownComponentType.Camera:
      return <Icon svg={<Camera {...props} />} />;
    case KnownComponentType.Light:
      return <Icon svg={<Light {...props} />} />;
    case KnownComponentType.ModelRef:
    case KnownComponentType.SubModelRef:
      return <Icon svg={<Modelref {...props} />} />;
    case KnownComponentType.Tag:
      return <Icon svg={<Tag {...props} />} />;
    default:
      return <></>;
  }
};

ComponentTypeIcon.displayName = ComponentTypeIcon;

export default ComponentTypeIcon;
