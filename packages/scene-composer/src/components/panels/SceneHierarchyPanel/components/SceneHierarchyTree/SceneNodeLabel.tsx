import React, { FC, useCallback, useState } from 'react';
import { Button, Icon } from '@awsui/components-react';

import VisibilityToggle from '../../../../../components/VisibilityToggle';
import { KnownComponentType } from '../../../../../interfaces';
import './SceneNodeLabel.scss';
import { DeleteSvg } from '../../../../../assets/svgs';
import { useSceneHierarchyData } from '../../SceneHierarchyDataProvider';

import ComponentTypeIcon from './ComponentTypeIcon';

interface SceneNodeLabelProps {
  objectRef: string;
  labelText: string;
  componentTypes?: string[];
}

const SceneNodeLabel: FC<SceneNodeLabelProps> = ({ objectRef, labelText, componentTypes }) => {
  const { show, hide, remove, validationErrors } = useSceneHierarchyData();
  const [visible, setVisible] = useState(true);

  const error = validationErrors[objectRef];

  const componentTypeIcons = componentTypes
    ?.filter((type) => !!type && Object.keys(KnownComponentType).includes(type))
    .map((type) => <ComponentTypeIcon key={type} type={type} />);

  const toggleVisibility = useCallback(
    (newVisibility) => {
      if (newVisibility) {
        show(objectRef);
      } else {
        hide(objectRef);
      }

      setVisible(newVisibility);
    },
    [objectRef, visible, show, hide],
  );

  const onDelete = useCallback(() => {
    remove(objectRef);
  }, [objectRef]);

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
