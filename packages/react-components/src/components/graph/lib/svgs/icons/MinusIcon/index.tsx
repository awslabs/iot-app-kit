import React, { FC, HTMLAttributes } from 'react';

const MinusIcon: FC<HTMLAttributes<SVGElement>> = (props) => {
  return (
    <svg viewBox='0 0 100 16' {...props}>
      <rect width='100' height='16' />
    </svg>
  );
};

export default MinusIcon;
