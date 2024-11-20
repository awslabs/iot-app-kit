import type { SVGProps } from 'react';
const SvgTag = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} fill='none' {...props}>
    <g stroke='currentColor' strokeMiterlimit={10}>
      <path fill='currentColor' d='M7 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z' />
      <path strokeWidth={2} d='M7 13.125A6.125 6.125 0 1 0 7 .875a6.125 6.125 0 0 0 0 12.25Z' />
    </g>
  </svg>
);
export default SvgTag;
