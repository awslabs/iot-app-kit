import React, { useCallback, useEffect, useState } from 'react';
import type { TextWidget } from '~/customization/widgets/types';
import { useMode } from '~/features/dashboard-mode';
import { useIsWidgetSelected } from '~/features/widget-selection/use-is-widget-selected';
import { useCanvasControl } from '~/store/dashboard/use-canvas-control';
import './component.css';
import TextLink from './link';
import StyledText from './styledText';
import EditableStyledText from './styledText/editableText';
import StyledTextArea from './styledText/textArea';

const TextWidgetComponent: React.FC<TextWidget> = (widget) => {
  const { mode } = useMode();
  const isSelected = useIsWidgetSelected(widget);
  const { isUrl, value } = widget.properties;
  const [isEditing, setIsEditing] = useState(false);
  const { disableCanvas, enableCanvas } = useCanvasControl();

  const handleSetEdit = useCallback(
    (editing: boolean) => {
      if (editing) {
        disableCanvas();
      } else {
        enableCanvas();
      }

      setIsEditing(editing);
    },
    [disableCanvas, enableCanvas]
  );

  useEffect(() => {
    // allow immediate edit if no value on widget creation
    if (!value) handleSetEdit(true);
  }, [value, handleSetEdit]);

  useEffect(() => {
    return () => {
      /**
       * Handle edge case where a user right click deletes
       * the widget while in edit mode
       */
      handleSetEdit(false);
    };
  }, [handleSetEdit]);

  const props = {
    readOnly: mode === 'view',
    isSelected,
    handleSetEdit,
    ...widget,
  };

  if (mode === 'view') {
    if (isUrl) {
      return <TextLink {...widget} />;
    } else {
      return <StyledText {...widget} readonly />;
    }
  } else {
    if (isUrl) {
      return <StyledTextArea isUrl {...props} />;
    } else if (isEditing) {
      return <StyledTextArea {...props} />;
    } else {
      return <EditableStyledText {...props} />;
    }
  }
};

export default TextWidgetComponent;
