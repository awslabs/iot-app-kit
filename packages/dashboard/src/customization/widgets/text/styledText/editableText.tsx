import React, { useEffect, useState } from 'react';

import type { PointerEventHandler } from 'react';
import type { TextWidget } from '~/customization/widgets/types';
import { useIsWidgetSelected } from '~/features/widget-selection';
import { LEFT_MOUSE_BUTTON_EVENT_CODE } from '~/helpers/events';
import StyledText from './index';

type EditableStyledTextProps = TextWidget & {
  handleSetEdit: (isEditing: boolean) => void;
};

const EditableStyledText: React.FC<EditableStyledTextProps> = ({
  handleSetEdit,
  ...widget
}) => {
  const isSelected = useIsWidgetSelected(widget);

  const { x, y } = widget;

  const [editStaged, setEditStaged] = useState(false);
  useEffect(() => {
    setEditStaged(false);
  }, [x, y]);

  const handleStageEdit: PointerEventHandler = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON_EVENT_CODE) return;
    setEditStaged(true);
  };
  const handleToggleEdit: PointerEventHandler = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON_EVENT_CODE) return;
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
