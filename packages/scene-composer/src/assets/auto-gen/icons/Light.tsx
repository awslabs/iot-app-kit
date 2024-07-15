import * as React from 'react';
import type { SVGProps } from 'react';
const SvgLight = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={17} fill='none' {...props}>
    <path fill='currentColor' stroke='currentColor' strokeMiterlimit={10} d='M8 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' />
    <path
      stroke='currentColor'
      strokeMiterlimit={10}
      d='M4.46 4.97 2.34 2.85M8 3.5v-3M11.531 4.96l2.13-2.12M13 8.5h3M11.54 12.03l2.12 2.13M8 13.5v3M4.472 12.04l-2.12 2.12M3 8.5H0'
    />
  </svg>
);
export default SvgLight;
