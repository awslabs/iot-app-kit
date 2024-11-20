import type { SVGProps } from 'react';
const SvgChecked = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={12} fill='none' {...props}>
    <path stroke='#545B64' d='m1.41 5 4.71 4.71 8.29-8.3' />
  </svg>
);
export default SvgChecked;
