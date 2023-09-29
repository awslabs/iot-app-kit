import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useKeyPress } from '../../hooks/useKeyPress';
import {
  onBringWidgetsToFrontAction,
  onCopyWidgetsAction,
  onDeleteWidgetsAction,
  onPasteWidgetsAction,
  onSelectWidgetsAction,
  onSendWidgetsToBackAction,
} from '../../store/actions';
import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import { isFunction } from 'lodash';

type useKeyboardShortcutsProps = {
  deleteWidgets?: () => void;
};

export const useKeyboardShortcuts = ({ deleteWidgets: handleDeleteWidgetModal }: useKeyboardShortcutsProps) => {
  const dispatch = useDispatch();
  const selectedWidgets = useSelectedWidgets();

  const onClearSelection = () => {
    dispatch(
      onSelectWidgetsAction({
        widgets: [],
        union: false,
      })
    );
  };

  const copyWidgets = useCallback(() => {
    dispatch(
      onCopyWidgetsAction({
        widgets: selectedWidgets,
      })
    );
  }, [selectedWidgets]);

  const pasteWidgets = () => {
    dispatch(onPasteWidgetsAction({ position: undefined }));
  };

  const bringWidgetsToFront = () => {
    dispatch(onBringWidgetsToFrontAction());
  };

  const sendWidgetsToBack = () => {
    dispatch(onSendWidgetsToBackAction());
  };

  const deleteWidgets = useCallback(() => {
    if (isFunction(handleDeleteWidgetModal)) {
      handleDeleteWidgetModal();
    } else {
      dispatch(
        onDeleteWidgetsAction({
          widgets: selectedWidgets,
        })
      );
    }
  }, [selectedWidgets]);

  /**
   * Keyboard hotkey / shortcut configuration
   * key press filter makes sure that the event is not coming from
   * other areas where we might use keyboard interactions such as
   * the settings pane or a text area in a widget
   */

  const keyPressFilter = (e: KeyboardEvent) =>
    e.target !== null &&
    e.target instanceof Element &&
    (e.target.id === DASHBOARD_CONTAINER_ID || e.target === document.body);

  useKeyPress('esc', { filter: keyPressFilter, callback: onClearSelection });
  useKeyPress('backspace, del', { filter: keyPressFilter, callback: deleteWidgets });
  useKeyPress('mod+c', { filter: keyPressFilter, callback: copyWidgets });
  useKeyPress('mod+v', { filter: keyPressFilter, callback: pasteWidgets });
  useKeyPress('[', { filter: keyPressFilter, callback: sendWidgetsToBack });
  useKeyPress(']', { filter: keyPressFilter, callback: bringWidgetsToFront });
};
