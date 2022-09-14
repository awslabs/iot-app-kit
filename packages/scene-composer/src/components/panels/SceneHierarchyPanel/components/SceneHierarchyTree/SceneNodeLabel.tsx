import React, { FC, useCallback } from 'react';
import { Button, Icon } from '@awsui/components-react';

import VisbilityToggle from '../../../../../components/VisibilityToggle';
import { KnownComponentType } from '../../../../../interfaces';
import useLogger from '../../../../../logger/react-logger/hooks/useLogger';
import { ReactComponent as CameraIcon } from '../../../../../assets/icons/camera.svg';
import { ReactComponent as LightIcon } from '../../../../../assets/icons/light.svg';
import { ReactComponent as ModelRefIcon } from '../../../../../assets/icons/modelref.svg';
import { ReactComponent as TagIcon } from '../../../../../assets/icons/tag.svg';
import './SceneNodeLabel.scss';
import { DeleteSvg } from '../../../../../assets/svgs';

const ComponentTypeIcon = ({ type, ...props }: { type: string }) => {
  switch (type) {
    case KnownComponentType.Camera:
      return <Icon svg={<CameraIcon {...props} />} />;
    case KnownComponentType.Light:
      return <Icon svg={<LightIcon {...props} />} />;
    case KnownComponentType.ModelRef:
    case KnownComponentType.SubModelRef:
      return <Icon svg={<ModelRefIcon {...props} />} />;
    case KnownComponentType.Tag:
      return <Icon svg={<TagIcon {...props} />} />;
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
  const log = useLogger('SceneNodeLabel');

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
        <VisbilityToggle visible={visible} onToggle={toggleVisibility} />
      </span>
    </span>
  );
};

SceneNodeLabel.displayName = 'SceneNodeLabel';

export default SceneNodeLabel;
