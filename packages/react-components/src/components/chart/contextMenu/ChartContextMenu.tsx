import { useEffect, useState } from 'react';
import { Menu, type MenuOptionProps } from '../../menu';
import { CONTEXT_MENU_Z_INDEX } from '../eChartsConstants';

type ContextMenuAction = (offsetX: number) => void;
type ContextMenuOption = Omit<
  MenuOptionProps,
  'onClick' | 'onKeyboardEnter' | 'action'
> & {
  onClick?: ContextMenuAction;
  onKeyboardEnter?: ContextMenuAction;
  action?: ContextMenuAction;
};

interface ChartContextMenu {
  targetTrigger: React.RefObject<HTMLDivElement>;
  options?: ContextMenuOption[];
}
const ChartContextMenu = ({
  targetTrigger,
  options = [],
}: ChartContextMenu) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const element = targetTrigger.current;
    if (!element) return;
    const handleContextMenu = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setShowContextMenu(true);
      setPosition({ x: e.offsetX, y: e.offsetY });
    };
    const handleCloseMenu = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') {
        setShowContextMenu(false);
      }
    };
    element.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleCloseMenu);

    return () => {
      element.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleCloseMenu);
    };
  }, [targetTrigger]);

  if (!showContextMenu || options.length === 0) return null;

  const handleAction = (cb?: ContextMenuAction) => () => {
    if (!cb) return;
    setShowContextMenu(false);
    cb(position.x);
  };

  const mappedOptions = options.map((o) => ({
    ...o,
    onClick: handleAction(o.onClick),
    onKeyboardEnter: handleAction(o.onKeyboardEnter),
    action: handleAction(o.action),
  }));

  return (
    <Menu
      classNames='chart-menu'
      styles={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: CONTEXT_MENU_Z_INDEX,
      }}
      onClickOutside={() => {
        // only triggers outside of the chart ref
        setShowContextMenu(false);
      }}
      options={mappedOptions}
    />
  );
};

export default ChartContextMenu;
