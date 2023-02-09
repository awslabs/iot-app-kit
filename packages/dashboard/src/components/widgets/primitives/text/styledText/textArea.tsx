import React, { CSSProperties, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useClickOutside } from '../../../../../hooks/useClickOutside';
import { useKeyPress } from '../../../../../hooks/useKeyPress';
import { onUpdateWidgetsAction } from '../../../../../store/actions';
import { TextWidget } from '../../../../../types';

import './textArea.css';

type StyledTextAreaProps = TextWidget & {
  handleSetEdit: (isEditing: boolean) => void;
};

const StyledTextArea: React.FC<StyledTextAreaProps> = ({ handleSetEdit, ...widget }) => {
  const dispatch = useDispatch();

  const { text, font, fontSize, italic, bold, underline, color, messageOverrides } = widget;

  const addPlaceholder = text.length === 0;

  const className = `text-widget text-widget-editing ${italic ? 'text-widget-italic' : ''} ${
    bold ? 'text-widget-bold' : ''
  } ${underline ? 'text-widget-underline' : ''} ${addPlaceholder ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontFamily: font,
    fontSize,
    color,
  };

  const handleSetText = (text: string) => {
    const updatedWidget: TextWidget = {
      ...widget,
      text,
    };
    dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
  };

  const ref = useClickOutside<HTMLTextAreaElement>(() => handleSetEdit(false));
  useEffect(() => {
    if (ref.current) {
      ref.current.selectionStart = text.length;
      ref.current.focus();
    }
  }, [ref]);

  const filter = (e: KeyboardEvent) => e.target === ref.current;
  useKeyPress('mod+shift+l', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        isLink: true,
        link: text,
      };
      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
      handleSetEdit(false);
    },
    filter,
  });
  useKeyPress('mod+b', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        bold: !bold,
      };
      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
    },
    filter,
  });
  useKeyPress('mod+i', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        italic: !italic,
      };
      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
    },
    filter,
  });
  useKeyPress('mod+u', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        underline: !underline,
      };
      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
    },
    filter,
  });
  useKeyPress('cmd+=', {
    callback: (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!fontSize) return;
      const updatedWidget: TextWidget = {
        ...widget,
        fontSize: fontSize + 1,
      };
      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
    },
    filter,
  });
  useKeyPress('cmd+-', {
    callback: (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!fontSize) return;
      const updatedWidget: TextWidget = {
        ...widget,
        fontSize: fontSize - 1,
      };
      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
    },
    filter,
  });

  return (
    <textarea
      ref={ref}
      value={text}
      onChange={(e) => handleSetText(e.target.value)}
      placeholder={messageOverrides?.placeholder}
      style={style}
      className={className}
    ></textarea>
  );
};

export default StyledTextArea;
