import { type FC, useCallback, useState } from 'react';
import { Button } from '@cloudscape-design/components';

import VisibilityToggle from '../../../../../components/VisibilityToggle';
import { KnownComponentType } from '../../../../../interfaces';
import './SceneNodeLabel.scss';
import { DeleteSvg } from '../../../../../assets/svgs';
import { useSceneHierarchyData } from '../../SceneHierarchyDataProvider';

import ComponentTypeIcon from './ComponentTypeIcon';

export interface SceneNodeLabelProps {
  dataTestid: string | undefined;
  objectRef: string;
  labelText: string;
  componentTypes?: string[];
}

const SceneNodeLabel: FC<SceneNodeLabelProps> = ({ dataTestid, objectRef, labelText, componentTypes }) => {
  const { toggleObjectVisibility, remove, validationErrors } = useSceneHierarchyData();
  const [visible, setVisible] = useState(true);
  const error = validationErrors[objectRef];

  const componentTypeIcons = componentTypes
    ?.filter((type) => !!type && Object.keys(KnownComponentType).includes(type))
    .map((type) => <ComponentTypeIcon key={type} type={type} />);

  const toggleVisibility = useCallback(
    (newVisibility) => {
      toggleObjectVisibility(objectRef);
      setVisible(newVisibility);
    },
    [objectRef, visible, toggleObjectVisibility],
  );

  const onDelete = useCallback(() => {
    remove(objectRef);
  }, [objectRef]);

  return (
    <span data-testid={dataTestid} className={`tm-scene-node-label ${error ? 'error' : ''}`.trim()} title={error}>
      {componentTypeIcons}
      <p className='tm-scene-node-label-inner'>{labelText}</p>
      <span className='actions'>
        {!!error && <Button onClick={onDelete} variant='inline-icon' iconSvg={DeleteSvg} />}
        <VisibilityToggle visible={visible} onToggle={toggleVisibility} />
      </span>
    </span>
  );
};

SceneNodeLabel.displayName = 'SceneNodeLabel';

export default SceneNodeLabel;
