import React, { useRef } from 'react';
import Box from '@cloudscape-design/components/box';
import { useDrag } from 'react-dnd';

import { ItemTypes } from '../dragLayer/itemTypes';
import PaletteComponentIcon from './icons';

import type { ComponentPaletteDraggable } from './types';

type PaletteComponentProps = {
  name: string;
  componentTag: string;
  IconComponent: React.FC;
};

const PaletteComponent: React.FC<PaletteComponentProps> = ({ componentTag, name, IconComponent }) => {
  const node = useRef(null);

  const [_, dragRef] = useDrag(
    () => ({
      type: ItemTypes.Component,
      item: (): ComponentPaletteDraggable => {
        return {
          componentTag,
          rect: node.current ? (node.current as Element).getBoundingClientRect() : null, // Used to determine the cursor offset from the upper left corner on drop
        };
      },
    }),
    []
  );

  return (
    <div ref={node}>
      <div aria-label={`add ${name} widget`} role='button' ref={dragRef}>
        <PaletteComponentIcon Icon={IconComponent} />
      </div>
      <Box textAlign='center' variant='awsui-key-label'>
        <small>{name}</small>
      </Box>
    </div>
  );
};

export default PaletteComponent;
