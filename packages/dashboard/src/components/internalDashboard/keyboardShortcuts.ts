import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelectedWidgetIds } from '~/hooks/useSelectedWidget';
import { useKeyPress } from '../../hooks/useKeyPress';
import {
  onBringWidgetsToFrontAction,
  onCopyWidgetsAction,
  onPasteWidgetsAction,
  onSelectWidgetsAction,
  onSendWidgetsToBackAction,
} from '../../store/actions';
import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';

export interface UseKeyboardShortcutsOptions {
  onPressDelete: VoidFunction;
}

export const useKeyboardShortcuts = ({
  onPressDelete,
}: UseKeyboardShortcutsOptions) => {
  const dispatch = useDispatch();
  const widgetWidgetIds = useSelectedWidgetIds();

  const onClearSelection = () => {
    dispatch(onSelectWidgetsAction({ widgetIds: [] }));
  };

  const copyWidgets = useCallback(() => {
    dispatch(
      onCopyWidgetsAction({
        widgetIds: widgetWidgetIds,
      })
    );
  }, [dispatch, widgetWidgetIds]);

  const pasteWidgets = () => {
    dispatch(onPasteWidgetsAction({ position: undefined }));
  };

  const bringWidgetsToFront = () => {
    dispatch(onBringWidgetsToFrontAction());
  };

  const sendWidgetsToBack = () => {
    dispatch(onSendWidgetsToBackAction());
  };

  // Keyboard hotkey / shortcut configuration
  // key press filter makes sure that the event is not coming from
  // other areas where we might use keyboard interactions such as
  // the settings pane or a text area in a widget
  const keyPressFilter = (e: KeyboardEvent | ClipboardEvent) =>
    e.target !== null &&
    e.target instanceof Element &&
    (e.target.id === DASHBOARD_CONTAINER_ID || e.target === document.body);

  useKeyPress('esc', { filter: keyPressFilter, callback: onClearSelection });
  useKeyPress('backspace, del', {
    filter: keyPressFilter,
    callback: onPressDelete,
  });
  useKeyPress('mod+c', { filter: keyPressFilter, callback: copyWidgets });
  useKeyPress('mod+v', { filter: keyPressFilter, callback: pasteWidgets });
  useKeyPress('[', { filter: keyPressFilter, callback: sendWidgetsToBack });
  useKeyPress(']', { filter: keyPressFilter, callback: bringWidgetsToFront });
};
