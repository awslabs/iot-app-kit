import React, { FC, HTMLAttributes } from 'react';

const PlusIcon: FC<HTMLAttributes<SVGElement>> = (props) => {
  return (
    <svg viewBox='0 0 100 100' {...props}>
      <polygon points='55.5555555 0 55.5554688 44.4442708 100 44.4444445 100 55.5555555 55.5554688 55.5554688 55.5555555 100 44.4444445 100 44.4442708 55.5554688 0 55.5555555 0 44.4444445 44.4442708 44.4442708 44.4444445 0' />
    </svg>
  );
};

export default PlusIcon;
