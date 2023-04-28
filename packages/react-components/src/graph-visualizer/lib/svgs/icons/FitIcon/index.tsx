import React from 'react';
import { createClassName, ClassName } from '../../../utils/element';

import baseStyles from '../styles.module.css';

export function FitIcon({ className }: { className?: ClassName }) {
  return (
    <svg className={createClassName(baseStyles.svg, className)} viewBox='0 0 100 100'>
      <path d='M30 10H10v20H0V0h30v10ZM70 90h20V70h10v30H70V90Z' />
      <path d='M80 20v60H20V20h60ZM70 30H30v40h40V30Z' />
      <path d='M90 30V10H70V0h30v30H90ZM10 70v20h20v10H0V70h10Z' />
    </svg>
  );
}
