import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={150} height={150} fill='none' viewBox='0 0 41 41' {...props}>
    <path stroke='#fff' strokeLinejoin='round' strokeWidth={4} d='M6.968 20.5h25.095M23.698 29l8.365-8.5-8.365-8.5' />
  </svg>
);
export default SvgArrow;
