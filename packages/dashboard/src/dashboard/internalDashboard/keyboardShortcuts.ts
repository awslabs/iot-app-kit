import { isFunction } from 'lodash';
import { useCallback } from 'react';
import { DASHBOARD_CONTAINER_ID } from '~/features/dashboard-canvas/getDashboardPosition';
import { useDashboardHistory } from '~/features/dashboard-history';
import { useWidgetLayers } from '~/features/layers/use-widget-layers';
import { useCopyPasteWidgets } from '~/features/widget-copy-paste/use-copy-paste-widgets';
import { useDeleteWidgets } from '~/features/widget-deletion/use-delete-widgets';
import { useSelectWidgets } from '~/features/widget-selection/use-select-widgets';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import { useKeyPress } from '~/hooks/useKeyPress';

type useKeyboardShortcutsProps = {
  deleteWidgets?: () => void;
};

export const useKeyboardShortcuts = ({
  deleteWidgets: handleDeleteWidgetModal,
}: useKeyboardShortcutsProps) => {
  const selectedWidgets = useSelectedWidgetIds();
  const deleteWidgets = useDeleteWidgets();
  const { sendToBack, bringToFront } = useWidgetLayers();
  const { copy, paste } = useCopyPasteWidgets();
  const { deselect } = useSelectWidgets();
  const { undo, redo } = useDashboardHistory();

  const handleDeleteWidgets = useCallback(() => {
    if (isFunction(handleDeleteWidgetModal)) {
      handleDeleteWidgetModal();
    } else {
      deleteWidgets({ widgetIds: selectedWidgets });
    }
  }, [selectedWidgets, handleDeleteWidgetModal, deleteWidgets]);

  /**
   * Keyboard hotkey / shortcut configuration
   * key press filter makes sure that the event is not coming from
   * other areas where we might use keyboard interactions such as
   * the settings pane or a text area in a widget
   */

  const keyPressFilter = (e: KeyboardEvent | ClipboardEvent) =>
    e.target !== null &&
    e.target instanceof Element &&
    (e.target.id === DASHBOARD_CONTAINER_ID || e.target === document.body);

  useKeyPress('esc', { filter: keyPressFilter, callback: deselect });
  useKeyPress('backspace, del', {
    filter: keyPressFilter,
    callback: handleDeleteWidgets,
  });
  useKeyPress('mod+c', { filter: keyPressFilter, callback: copy });
  useKeyPress('mod+v', { filter: keyPressFilter, callback: paste });
  useKeyPress('[', { filter: keyPressFilter, callback: sendToBack });
  useKeyPress(']', { filter: keyPressFilter, callback: bringToFront });
  useKeyPress('mod+z', { filter: keyPressFilter, callback: undo });
  useKeyPress('shift+mod+z', { filter: keyPressFilter, callback: redo });
};
