import { useState } from 'react';
import { ElementEvent } from 'echarts';

export const useContextMenu = () => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const handleContextMenu = (e: ElementEvent) => {
    setContextMenuPos({ x: e.offsetX, y: e.offsetY });
    setShowContextMenu(!showContextMenu);
    e.stop();
  };

  return {
    handleContextMenu,
    showContextMenu,
    contextMenuPos,
    setShowContextMenu,
  };
};
