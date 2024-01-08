import React, { useEffect, useState } from 'react';

import StyledText from './index';
import { useIsSelected } from '~/customization/hooks/useIsSelected';
import { MouseClick } from '~/types';
import type { PointerEventHandler } from 'react';
import type { TextWidget } from '../../types';

type EditableStyledTextProps = TextWidget & {
  handleSetEdit: (isEditing: boolean) => void;
};

const EditableStyledText: React.FC<EditableStyledTextProps> = ({
  handleSetEdit,
  ...widget
}) => {
  const isSelected = useIsSelected(widget);

  const { x, y } = widget;

  const [editStaged, setEditStaged] = useState(false);
  useEffect(() => {
    setEditStaged(false);
  }, [x, y]);

  const handleStageEdit: PointerEventHandler = (e) => {
    if (e.button !== MouseClick.Left) return;
    setEditStaged(true);
  };
  const handleToggleEdit: PointerEventHandler = (e) => {
    if (e.button !== MouseClick.Left) return;
    if (isSelected && editStaged) {
      handleSetEdit(true);
    }
  };

  return (
    <StyledText
      onPointerDown={handleStageEdit}
      onPointerUp={handleToggleEdit}
      {...widget}
    />
  );
};

export default EditableStyledText;
