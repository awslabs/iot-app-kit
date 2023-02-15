import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onChangeDashboardGridEnabledAction } from '~/store/actions';

import { TextWidget as TextWidgetType } from '../../../../types';

import StyledText from './styledText';
import EditableStyledText from './styledText/editableText';
import StyledTextArea from './styledText/textArea';

import TextLink from './link';
import EditableTextLink from './link/editableLink';

import './index.css';

export type TextWidgetProps = TextWidgetType & { readOnly: boolean; isSelected: boolean };

const TextWidget: React.FC<TextWidgetProps> = ({ readOnly, isSelected, ...widget }) => {
  const { isLink } = widget;

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleSetEdit = (editing: boolean) => {
    dispatch(onChangeDashboardGridEnabledAction({ enabled: !editing }));
    setIsEditing(editing);
  };

  const props = { readOnly, isSelected, handleSetEdit, ...widget };

  if (readOnly) {
    if (isLink) {
      return <TextLink {...widget} />;
    } else {
      return <StyledText {...widget} />;
    }
  } else {
    if (isLink) {
      return <EditableTextLink {...props} />;
    } else if (isEditing) {
      return <StyledTextArea {...props} />;
    } else {
      return <EditableStyledText {...props} />;
    }
  }
};

export default TextWidget;
