import React from 'react';
import { createClassName, ClassName } from '../../../utils/element';

import baseStyles from '../styles.module.css';

export function TargetIcon({ className }: { className?: ClassName }) {
  return (
    <svg className={createClassName(baseStyles.svg, className)} viewBox='0 0 100 100'>
      <path d='M50 31.818c-10.045 0-18.182 8.137-18.182 18.182 0 10.045 8.137 18.182 18.182 18.182 10.045 0 18.182-8.137 18.182-18.182 0-10.045-8.137-18.182-18.182-18.182Zm40.636 13.637c-2.09-18.955-17.136-34-36.09-36.091V0h-9.091v9.364c-18.955 2.09-34 17.136-36.091 36.09H0v9.091h9.364c2.09 18.955 17.136 34 36.09 36.091V100h9.091v-9.364c18.955-2.09 34-17.136 36.091-36.09H100v-9.091h-9.364ZM50 81.818c-17.59 0-31.818-14.227-31.818-31.818 0-17.59 14.227-31.818 31.818-31.818 17.59 0 31.818 14.227 31.818 31.818 0 17.59-14.227 31.818-31.818 31.818Z' />
    </svg>
  );
}
