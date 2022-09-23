import React, { DetailedHTMLProps, FC, LabelHTMLAttributes } from 'react';
import { Button } from '@awsui/components-react';

import VisibilityToggle from '../../../../VisibilityToggle';

interface TreeItemLabelProps extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  onAdd: () => void;
  onVisibilityToggled?: (show: boolean) => void;
  visible: boolean;
}

const SubModelTreeItemLabel: FC<TreeItemLabelProps> = ({ onAdd, visible, onVisibilityToggled, children, ...props }) => {
  return (
    <span {...props}>
      <p>{children}</p>
      <span className='actions'>
        <Button className='tm-icon-button' iconName='add-plus' variant={'inline-icon'} onClick={onAdd} />
        <VisibilityToggle className='tm-icon-button' visible={visible} onToggle={onVisibilityToggled} />
      </span>
    </span>
  );
};

SubModelTreeItemLabel.displayName = 'SubModelTreeItemLabel';

export default SubModelTreeItemLabel;
