import React, { FC, useCallback } from 'react';
import { Button, Icon } from '@awsui/components-react';

import VisibilityToggle from '../../../../../components/VisibilityToggle';
import { KnownComponentType } from '../../../../../interfaces';
import { Camera, Light, Modelref, Tag } from '../../../../../assets/auto-gen/icons';
import './SceneNodeLabel.scss';
import { DeleteSvg } from '../../../../../assets/svgs';

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
interface SceneNodeLabelProps {
  labelText: string;
  componentTypes?: string[];
  error?: string;
  visible?: boolean;
  onVisibilityChange?: (newVisibility: boolean) => void;
  onDelete: () => void;
}

const SceneNodeLabel: FC<SceneNodeLabelProps> = ({
  labelText,
  componentTypes,
  error,
  visible,
  onVisibilityChange = () => {},
  onDelete,
}) => {
  const toggleVisibility = useCallback(
    (show: boolean) => {
      onVisibilityChange(show);
    },
    [onVisibilityChange],
  );

  const componentTypeIcons = componentTypes
    ?.filter((type) => !!type && Object.keys(KnownComponentType).includes(type))
    .map((type) => <ComponentTypeIcon key={type} type={type} />);

  return (
    <span className={`tm-scene-node-label ${error ? 'error' : ''}`.trim()} title={error}>
      {componentTypeIcons}
      <p className='tm-scene-node-label-inner'>{labelText}</p>
      <span className='actions'>
        {!!error && <Button onClick={onDelete} variant={'inline-icon'} iconSvg={DeleteSvg} />}
        <VisibilityToggle visible={visible} onToggle={toggleVisibility} />
      </span>
    </span>
  );
};

SceneNodeLabel.displayName = 'SceneNodeLabel';

export default SceneNodeLabel;
