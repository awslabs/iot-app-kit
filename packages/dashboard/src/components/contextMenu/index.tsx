import React, { useEffect, useState } from 'react';
import Menu from './menu';
import ContextMenuSection from './section';
import ContextMenuOption from './option';
import { DASHBOARD_CONTAINER_ID, getDashboardPosition } from '../grid/getDashboardPosition';
import { useKeyPress } from '~/hooks/useKeyPress';
import { createContextMenuOptions } from './contextMenuOptions';
import { useLayers } from '../internalDashboard/useLayers';
import type { Position } from '~/types';
import type { DashboardMessages } from '~/messages';

export type ContextMenuProps = {
  copyWidgets: () => void;
  pasteWidgets: (position: Position) => void;
  deleteWidgets: () => void;
  bringWidgetsToFront: () => void;
  sendWidgetsToBack: () => void;
  messageOverrides: DashboardMessages;
  hasCopiedWidgets: boolean;
  hasSelectedWidgets: boolean;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  messageOverrides,
  hasCopiedWidgets,
  hasSelectedWidgets,
  copyWidgets,
  pasteWidgets,
  deleteWidgets,
  bringWidgetsToFront,
  sendWidgetsToBack,
}) => {
  const [contextMenuOpen, setContextMenuOpen] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<Position | null>(null);

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

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    toggleContextMenu(getDashboardPosition(e));
  };

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
  }, []);

  const withClose = (action: () => void) => () => {
    action();
    toggleContextMenu();
  };

  const copyAction = withClose(() => copyWidgets());
  const pasteAction = withClose(() => pasteWidgets(contextMenuPosition || { x: 0, y: 0 }));
  const deleteAction = withClose(() => deleteWidgets());
  const bringToFrontAction = withClose(() => bringWidgetsToFront());
  const sendToBackAction = withClose(() => sendWidgetsToBack());

  const configuration = createContextMenuOptions({
    messages: messageOverrides.contextMenu,
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
    <Menu clickOutside={onClickOutside} position={{ ...contextMenuPosition, z: contextMenuLayer }}>
      {configuration.map(({ id: sectionId, options }) => (
        <ContextMenuSection key={sectionId}>
          {options.map(({ id: optionId, text, action, hotkey, disabled }) => (
            <ContextMenuOption key={optionId} text={text} action={action} hotkey={hotkey} disabled={disabled} />
          ))}
        </ContextMenuSection>
      ))}
    </Menu>
  ) : null;
};

export default ContextMenu;
