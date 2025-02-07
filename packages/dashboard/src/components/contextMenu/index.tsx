import { spaceScaledXxxs } from '@cloudscape-design/design-tokens';
import { useCallback, useEffect, useState } from 'react';
import { useKeyPress } from '~/hooks/useKeyPress';
import type { Position } from '~/types';
import {
  DASHBOARD_CONTAINER_ID,
  getDashboardPosition,
} from '../grid/getDashboardPosition';
import { useLayers } from '../internalDashboard/useLayers';
import { createContextMenuOptions } from './contextMenuOptions';
import { Menu } from './menu';
import { ContextMenuOption } from './option';
import './menu.css';

export interface ContextMenuProps {
  copyWidgets: VoidFunction;
  pasteWidgets: (position: Position) => void;
  deleteWidgets: VoidFunction;
  bringWidgetsToFront: VoidFunction;
  sendWidgetsToBack: VoidFunction;
  hasCopiedWidgets: boolean;
  hasSelectedWidgets: boolean;
}

export const ContextMenu = ({
  hasCopiedWidgets,
  hasSelectedWidgets,
  copyWidgets,
  pasteWidgets,
  deleteWidgets,
  bringWidgetsToFront,
  sendWidgetsToBack,
}: ContextMenuProps) => {
  const [contextMenuOpen, setContextMenuOpen] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] =
    useState<Position | null>(null);

  const { contextMenuLayer } = useLayers();

  const toggleContextMenu = (position?: Position) => {
    if (position) {
      setContextMenuOpen(true);
      setContextMenuPosition(position);
    } else {
      setContextMenuOpen(false);
      setContextMenuPosition(null);
    }
  };

  useKeyPress('esc', () => toggleContextMenu());

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    toggleContextMenu(getDashboardPosition(e));
  }, []);

  const onClickOutside = () => {
    toggleContextMenu();
  };

  useEffect(() => {
    const dashboardContainer = document.getElementById(DASHBOARD_CONTAINER_ID);
    if (!dashboardContainer) return;

    dashboardContainer.addEventListener('contextmenu', onContextMenu);

    return () => {
      dashboardContainer.removeEventListener('contextmenu', onContextMenu);
    };
  }, [onContextMenu]);

  const withClose = (action: () => void) => () => {
    action();
    toggleContextMenu();
  };

  const copyAction = withClose(() => copyWidgets());
  const pasteAction = withClose(() =>
    pasteWidgets(contextMenuPosition || { x: 0, y: 0 })
  );
  const deleteAction = withClose(() => deleteWidgets());
  const bringToFrontAction = withClose(() => bringWidgetsToFront());
  const sendToBackAction = withClose(() => sendWidgetsToBack());

  const configuration = createContextMenuOptions({
    actions: {
      copyAction,
      pasteAction,
      deleteAction,
      bringToFrontAction,
      sendToBackAction,
    },
    state: {
      hasCopiedWidgets: hasCopiedWidgets,
      hasSelectedWidgets: hasSelectedWidgets,
    },
  });

  return contextMenuOpen && contextMenuPosition ? (
    <div>
      <Menu
        clickOutside={onClickOutside}
        position={{ ...contextMenuPosition, z: contextMenuLayer }}
      >
        {configuration.map(({ id: sectionId, options }) => (
          <ul
            className='iot-context-list-container'
            key={sectionId}
            style={{ margin: `calc(${spaceScaledXxxs} * -1)` }}
          >
            {options.map(({ id: optionId, text, action, hotkey, disabled }) => (
              <ContextMenuOption
                key={optionId}
                text={text}
                action={action}
                hotkey={hotkey}
                disabled={disabled}
              />
            ))}
          </ul>
        ))}
      </Menu>
    </div>
  ) : null;
};
