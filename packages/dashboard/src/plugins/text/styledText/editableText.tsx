import { type PointerEventHandler, useEffect, useState } from 'react';
import { MouseClick } from '~/types';
import { StyledText } from './index';
import type { TEXT_WIDGET_TYPE } from '../constants';
import { useIsWidgetSelected } from '~/features/selection/use-is-widget-selected';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface EditableStyledTextProps {
  widget: WidgetInstance<typeof TEXT_WIDGET_TYPE>;
  handleSetEdit: (isEditing: boolean) => void;
}

export const EditableStyledText = ({
  widget,
  handleSetEdit,
}: EditableStyledTextProps) => {
  const isSelected = useIsWidgetSelected({ widgetId: widget.id });

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
      widget={widget}
    />
  );
};
