import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onChangeDashboardGridEnabledAction } from '~/store/actions';

import StyledText from './styledText';
import EditableStyledText from './styledText/editableText';
import StyledTextArea from './styledText/textArea';

import TextLink from './link';
import { useIsSelected } from '~/customization/hooks/useIsSelected';

import './component.css';
import type { TextWidget } from '../types';
import type { DashboardState } from '~/store/state';
import WidgetTile from '~/components/widgets/tile/tile';

const TextWidgetComponent: React.FC<TextWidget> = (widget) => {
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const isSelected = useIsSelected(widget);
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

  const props = { readOnly, isSelected, handleSetEdit, ...widget };

  const renderTextArea = ({
    isUrl,
    isEditing,
  }: {
    isUrl?: boolean;
    isEditing: boolean;
  }) => {
    if (isUrl) {
      return <StyledTextArea isUrl {...props} />;
    } else if (isEditing) {
      return <StyledTextArea {...props} />;
    } else {
      return <EditableStyledText {...props} />;
    }
  };

  if (readOnly) {
    if (isUrl) {
      return <TextLink {...widget} />;
    } else {
      return <StyledText {...widget} />;
    }
  } else {
    return (
      <WidgetTile widget={widget}>
        {renderTextArea({ isUrl, isEditing })}
      </WidgetTile>
    );
  }
};

export default TextWidgetComponent;
