import React from 'react';
import { Menu, MenuOption } from '../../menu';

import { CONTEXT_MENU_Z_INDEX } from '../eChartsConstants';
import { MAX_TREND_CURSORS } from '../trendCursor/constants';
import { InternalGraphicComponentGroupOption } from '../trendCursor/types';

export type Action = 'add' | 'delete' | 'copy';
interface ChartContextMenu {
  position: { x: number; y: number };
  menuOptionClickHandler: ({
    action,
    e,
  }: {
    action: Action;
    e: React.MouseEvent;
  }) => void;
  onOutSideClickHandler: (e: PointerEvent) => void;
  trendCursors: InternalGraphicComponentGroupOption[];
}
const ChartContextMenu = ({
  position,
  menuOptionClickHandler,
  onOutSideClickHandler,
  trendCursors,
}: ChartContextMenu) => {
  return (
    <Menu
      styles={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: CONTEXT_MENU_Z_INDEX,
      }}
      onClickOutside={onOutSideClickHandler}
    >
      <MenuOption
        label='Add trend cursor'
        onClick={(e) => menuOptionClickHandler({ action: 'add', e })}
        disabled={trendCursors.length >= MAX_TREND_CURSORS}
      />
      <MenuOption
        label='Copy to clipboard'
        onClick={(e) => menuOptionClickHandler({ action: 'copy', e })}
        disabled={trendCursors.length === 0}
      />
      <MenuOption
        label='Delete trend cursor'
        onClick={(e) => menuOptionClickHandler({ action: 'delete', e })}
        disabled={trendCursors.length === 0}
      />
    </Menu>
  );
};

export default ChartContextMenu;
