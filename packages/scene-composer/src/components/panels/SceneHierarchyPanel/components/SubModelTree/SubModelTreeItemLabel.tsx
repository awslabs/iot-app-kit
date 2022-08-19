import React, { DetailedHTMLProps, FC, LabelHTMLAttributes, useCallback, useState } from 'react';
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
      {children}
      <span className='actions'>
        <Button iconName='add-plus' variant={'inline-icon'} onClick={onAdd} />
        <VisibilityToggle visible={visible} onToggle={onVisibilityToggled} />
      </span>
    </span>
  );
};

SubModelTreeItemLabel.displayName = 'SubModelTreeItemLabel';

export default SubModelTreeItemLabel;
