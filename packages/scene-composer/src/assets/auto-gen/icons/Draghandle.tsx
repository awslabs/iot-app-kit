import type { SVGProps } from 'react';
const SvgDraghandle = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={4} height={19} fill='none' {...props}>
    <path stroke='#879596' d='M.5.5v18M2.961.5v18' />
  </svg>
);
export default SvgDraghandle;
