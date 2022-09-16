import * as React from 'react';
import { SVGProps } from 'react';

const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg width={150} height={150} viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M6.968 20.5h25.095M23.698 29l8.365-8.5-8.365-8.5' stroke='#fff' strokeWidth={4} strokeLinejoin='round' />
  </svg>
);

export default SvgArrow;
