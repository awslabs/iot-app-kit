import React, { useEffect, useState } from 'react';

import StyledText from './index';
import { TextWidget } from '../../types';
import { useIsSelected } from '~/customization/hooks/useIsSelected';

type EditableStyledTextProps = TextWidget & {
  handleSetEdit: (isEditing: boolean) => void;
};

const EditableStyledText: React.FC<EditableStyledTextProps> = ({ handleSetEdit, ...widget }) => {
  const isSelected = useIsSelected(widget);

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
