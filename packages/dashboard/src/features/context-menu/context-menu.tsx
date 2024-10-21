import React, { memo, useCallback, useEffect } from 'react';
import invariant from 'tiny-invariant';
import { useContextMenu } from '~/features/context-menu/use-context-menu';
import { useDeleteWidgets } from '~/features/widget-deletion/use-delete-widgets';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import { MODIFIER_KEY } from '~/helpers/env';
import { stopPropagation } from '~/helpers/events';
import { useWidgetLayers } from '../layers/use-widget-layers';
import { useCopyPasteWidgets } from '../widget-copy-paste/use-copy-paste-widgets';
import * as CM from './context-menu-elements';

export const ContextMenu = memo(function () {
  const { position, close } = useContextMenu();
  const selectedWidgetIds = useSelectedWidgetIds();
  const hasSelectedWidgets = selectedWidgetIds.length > 0;
  const deleteWidgets = useDeleteWidgets();
  const { bringToFront, sendToBack } = useWidgetLayers();
  const { canCopy, canPaste, copy, paste } = useCopyPasteWidgets();

  const handleCopyWidgets = useCallback(() => {
    copy();
    close();
  }, [copy, close]);

  const handlePasteWidgets = useCallback(() => {
    invariant(
      position,
      'Position must be defined to paste widgets with the context menu.'
    );
    paste({ position });
    close();
  }, [position, paste, close]);

  const handleDeleteWidgets = useCallback(() => {
    deleteWidgets({ widgetIds: selectedWidgetIds });
    close();
  }, [deleteWidgets, selectedWidgetIds, close]);

  const handleBringWidgetsToFront = useCallback(() => {
    bringToFront();
    close();
  }, [bringToFront, close]);

  const handleSendWidgetsToBack = useCallback(() => {
    sendToBack();
    close();
  }, [sendToBack, close]);

  // register event handler to close menu when something else is clicked
  useEffect(() => {
    window.addEventListener('click', close);

    // prevent dangling event handler
    return () => {
      window.removeEventListener('click', close);
    };
  }, [close]);

  if (!position) return null;

  return (
    <CM.Container
      x={position.x}
      y={position.y}
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
      onPointerUp={stopPropagation}
    >
      <CM.Options>
        <CM.Option key='copy-context-menu-option' aria-label='Copy'>
          <CM.OptionButton
            onClick={handleCopyWidgets}
            disabled={!canCopy}
            aria-label='Copy'
          >
            <p>Copy</p>
            <p>{MODIFIER_KEY}-c</p>
          </CM.OptionButton>
        </CM.Option>

        <CM.Option key='paste-context-menu-option' aria-label='Paste'>
          <CM.OptionButton
            onClick={handlePasteWidgets}
            disabled={!canPaste}
            aria-label='Paste'
          >
            <p>Paste</p>
            <p>{MODIFIER_KEY}-v</p>
          </CM.OptionButton>
        </CM.Option>

        <CM.Option key='delete-context-menu-option' aria-label='Delete'>
          <CM.OptionButton
            onClick={handleDeleteWidgets}
            disabled={!hasSelectedWidgets}
            aria-label='Delete'
          >
            <p>Delete</p>
          </CM.OptionButton>
        </CM.Option>

        <CM.Option
          key='bring-to-front-context-menu-option'
          aria-label='Bring to front'
        >
          <CM.OptionButton
            onClick={handleBringWidgetsToFront}
            disabled={!hasSelectedWidgets}
            aria-label='Bring to front'
          >
            <p>Bring to front</p>
            <p>]</p>
          </CM.OptionButton>
        </CM.Option>

        <CM.Option
          key='send-to-back-context-menu-option'
          aria-label='Send to back'
        >
          <CM.OptionButton
            onClick={handleSendWidgetsToBack}
            disabled={!hasSelectedWidgets}
            aria-label='Send to back'
          >
            <p>Send to back</p>
            <p>[</p>
          </CM.OptionButton>
        </CM.Option>
      </CM.Options>
    </CM.Container>
  );
});
