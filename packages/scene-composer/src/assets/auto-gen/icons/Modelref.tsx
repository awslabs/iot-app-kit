import type { SVGProps } from 'react';
const SvgModelref = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} fill='none' {...props}>
    <g stroke='currentColor' strokeMiterlimit={10} clipPath='url(#modelref_svg__a)'>
      <path d='M6.946 13.48.465 10.24V3.758L6.946.518l6.482 3.24v6.482z' />
      <path d='M.465 3.76 6.946 7l6.482-3.24M6.945 7v6.482' />
    </g>
    <defs>
      <clipPath id='modelref_svg__a'>
        <path fill='#fff' d='M0 0h13.889v14H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default SvgModelref;
