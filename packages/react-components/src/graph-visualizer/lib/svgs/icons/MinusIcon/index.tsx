import React from 'react';
import { createClassName, ClassName } from '../../../utils/element';

import baseStyles from '../styles.module.css';

export function MinusIcon({ className }: { className?: ClassName }) {
  return (
    <svg className={createClassName(baseStyles.svg, className)} viewBox='0 0 100 16'>
      <rect width='100' height='16' />
    </svg>
  );
}
