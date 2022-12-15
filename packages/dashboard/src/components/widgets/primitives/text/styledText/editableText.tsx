import React, { useEffect, useState } from 'react';

import { TextWidget } from '../../../../../types';
import StyledText from './index';

type EditableStyledTextProps = TextWidget & {
  isSelected: boolean;
  handleSetEdit: (isEditing: boolean) => void;
};

const EditableStyledText: React.FC<EditableStyledTextProps> = ({ isSelected, handleSetEdit, ...widget }) => {
  const { x, y } = widget;

  const [editStaged, setEditStaged] = useState(false);
  useEffect(() => {
    setEditStaged(false);
  }, [x, y]);

  const handleStageEdit = () => {
    setEditStaged(true);
  };
  const handleToggleEdit = () => {
    if (isSelected && editStaged) {
      handleSetEdit(true);
    }
  };

  return <StyledText onPointerDown={handleStageEdit} onPointerUp={handleToggleEdit} {...widget} />;
};

export default EditableStyledText;
