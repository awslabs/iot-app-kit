import Box from '@cloudscape-design/components/box';
import type { DragEventHandler, FC } from 'react';
import { useEffect } from 'react';
import './index.css';

type PaletteComponentIconProps = {
  Icon: React.FC;
  widgetName: string;
};

const PaletteComponentIcon: FC<PaletteComponentIconProps> = ({
  Icon,
  widgetName,
}) => {
  // Without this, Firefox widget drag and drop does not work correctly.
  const ignoreDragStart: DragEventHandler = (event) => event.preventDefault();

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <span
      onDragStart={ignoreDragStart}
    >
      <Box padding='xxs' className='palette-component-icon ripple'>
        <Icon />
      </Box>
    </span>
  );
};

export default PaletteComponentIcon;
