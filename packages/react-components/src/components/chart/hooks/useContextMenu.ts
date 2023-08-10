import { useState } from 'react';
import { ElementEvent } from 'echarts';
import { KeyMap } from 'react-hotkeys';

export const useContextMenu = () => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const handleContextMenu = (e: ElementEvent) => {
    setContextMenuPos({ x: e.offsetX, y: e.offsetY });
    setShowContextMenu(!showContextMenu);
    e.stop();
  };
  const keyMap: KeyMap = {
    commandDown: { sequence: 't', action: 'keydown' },
    commandUp: { sequence: 't', action: 'keyup' },
  };
  return { handleContextMenu, showContextMenu, contextMenuPos, setShowContextMenu, keyMap };
};
