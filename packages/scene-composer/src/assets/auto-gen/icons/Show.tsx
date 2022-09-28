import * as React from 'react';
import { SVGProps } from 'react';

const SvgShow = (props: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={14} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g clipPath='url(#show_svg__a)' fill='#879596'>
      <path
        className='show_svg__center-dot'
        d='M8 8.89a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
        stroke='#879596'
        strokeMiterlimit={10}
      />
      <path d='M7.85 3c2.27 0 4.57 1.31 6.85 3.9-1.07 1.22-3.77 3.88-7 3.88-2.25 0-4.42-1.31-6.46-3.9C2.16 5.69 4.61 3 7.85 3Zm0-1C3.11 2 0 6.89 0 6.89c2.67 3.67 5.33 4.89 7.7 4.89 4.74 0 8.3-4.89 8.3-4.89C13 3.22 10.22 2 7.85 2Z' />
    </g>
    <defs>
      <clipPath id='show_svg__a'>
        <path fill='#fff' transform='translate(0 2)' d='M0 0h16v9.78H0z' />
      </clipPath>
    </defs>
  </svg>
);

export default SvgShow;
