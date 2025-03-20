import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type WidgetComponentProps } from '~/features/widget-customization/types';
import { useIsWidgetSelected } from '~/features/selection/use-is-widget-selected';
import { onChangeDashboardGridEnabledAction } from '~/store/actions';
import type { DashboardState } from '~/store/state';
import { TextLink } from './text-link';
import { StyledText } from './styledText';
import { EditableStyledText } from './styledText/editableText';
import { StyledTextArea } from './styledText/textArea';
import type { TEXT_WIDGET_TYPE } from './constants';
import './component.css';

export type TextWidgetComponentProps = WidgetComponentProps<
  typeof TEXT_WIDGET_TYPE
>;

export const TextWidgetComponent = ({ widget }: TextWidgetComponentProps) => {
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const isSelected = useIsWidgetSelected({ widgetId: widget.id });
  const { isUrl, value } = widget.properties;

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const handleSetEdit = useCallback(
    (editing: boolean) => {
      dispatch(onChangeDashboardGridEnabledAction({ enabled: !editing }));
      setIsEditing(editing);
    },
    [dispatch]
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

  const props = { readOnly, isSelected, handleSetEdit };

  if (readOnly) {
    if (isUrl) {
      return <TextLink widget={widget} />;
    } else {
      return <StyledText readonly widget={widget} />;
    }
  } else {
    if (isUrl) {
      return <StyledTextArea {...props} widget={widget} />;
    } else if (isEditing) {
      return <StyledTextArea {...props} widget={widget} />;
    } else {
      return <EditableStyledText {...props} widget={widget} />;
    }
  }
};
