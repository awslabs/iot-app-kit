import React, { useCallback, useEffect, useRef, useState } from 'react';

import { usePopper } from 'react-popper';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';

import TextLink from './index';

import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { CancelableEventHandler } from '@cloudscape-design/components/internal/events';

import { useClickOutside } from '~/hooks/useClickOutside';
import { useHover } from '~/hooks/useHover';

import { TextWidget } from '../../types';
import { useWidgetActions } from '~/customization/hooks/useWidgetActions';

import './editableLink.css';

type EditableTextLinkProps = TextWidget & {
  isSelected: boolean;
  handleSetEdit: (isEditing: boolean) => void;
};

const EditableTextLink: React.FC<EditableTextLinkProps> = ({ isSelected, handleSetEdit, ...widget }) => {
  const { update } = useWidgetActions();

  const { x, y } = widget;
  const { value, href } = widget.properties;

  const editableMenuElementRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  const [editLinkAndText, setEditLinkAndText] = useState(false);
  const [editStaged, setEditStaged] = useState(false);
  useEffect(() => {
    setEditStaged(false);
  }, [x, y]);
  const handleStageEdit = () => {
    setEditStaged(true);
  };
  const handleToggleEdit = () => {
    if (isSelected && editStaged) {
      setShowPopover(true);
    }
  };

  const handleSetText = (text: string) => {
    const updatedWidget: TextWidget = {
      ...widget,
      properties: {
        ...widget.properties,
        value: text,
      },
    };
    update(updatedWidget);
  };
  const handleSetLink = (link: string) => {
    const updatedWidget: TextWidget = {
      ...widget,
      properties: {
        ...widget.properties,
        href: link,
      },
    };
    update(updatedWidget);
  };

  const handleShowEditMenu = (editing: boolean) => {
    setShowPopover(editing);
    handleSetEdit(editing);
    setEditLinkAndText(editing);
  };

  const handleClickEdit: CancelableEventHandler = () => {
    handleShowEditMenu(true);
  };
  const handleClickRemove: CancelableEventHandler = () => {
    const updatedWidget: TextWidget = {
      ...widget,
      properties: {
        ...widget.properties,
        href: '',
        isUrl: false,
      },
    };
    update(updatedWidget);
  };

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    handleShowEditMenu(false);
  });

  const callback = useCallback(
    (hovering, e) => {
      if (!isSelected || e.buttons !== 0) return;
      setShowPopover(hovering);
      if (!hovering && editLinkAndText) {
        setEditLinkAndText(false);
        handleSetEdit(false);
      }
    },
    [isSelected, editLinkAndText]
  );

  const [hoverable, , cancel] = useHover<HTMLDivElement>({
    callback,
    delay: 500,
  });

  useEffect(() => {
    cancel();
    setShowPopover(false);
  }, [x, y]);

  const { styles, attributes } = usePopper(hoverable.current, editableMenuElementRef.current, {
    placement: 'top-start',
    modifiers: [
      flip,
      preventOverflow,
      {
        name: 'offset',
        options: {
          offset: [-20, -10],
        },
      },
    ],
  });

  /**
   * These are required for cloudscape styling overrides.
   */
  const poppoverButtonAttributes = {
    'data-text-button': '',
  };
  const poppoverInputAttributes = {
    'data-text-form': '',
  };

  return (
    <div
      ref={hoverable}
      onPointerDown={handleStageEdit}
      onPointerUp={handleToggleEdit}
      className='text-widget-link-wrapper'
    >
      <TextLink {...widget} />
      {showPopover && (
        <div
          {...attributes}
          className='text-widget-link-edit-menu-wrapper'
          style={styles.popper}
          ref={editableMenuElementRef}
        >
          <div className='text-widget-link-edit-menu'>
            {editLinkAndText ? (
              <div className='text-widget-link-edit' ref={clickOutsideRef}>
                <FormField {...poppoverInputAttributes} label='Text'>
                  <Input
                    value={value}
                    inputMode='text'
                    type='text'
                    onChange={(event) => handleSetText(event.detail.value)}
                  />
                </FormField>
                <FormField {...poppoverInputAttributes} label='Link'>
                  <Input
                    value={href || ''}
                    inputMode='url'
                    type='url'
                    onChange={(event) => handleSetLink(event.detail.value)}
                  />
                </FormField>
              </div>
            ) : (
              <>
                {href && href.length > 0 && (
                  <Button iconName='external' variant='link' href={href} target='_blank' {...poppoverButtonAttributes}>
                    {href}
                  </Button>
                )}
                <Button onClick={handleClickEdit} iconName='edit' variant='link' {...poppoverButtonAttributes}>
                  Edit
                </Button>
                <Button onClick={handleClickRemove} iconName='close' variant='link' {...poppoverButtonAttributes}>
                  Remove
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTextLink;
