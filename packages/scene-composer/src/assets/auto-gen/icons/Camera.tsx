import * as React from 'react';
import { SVGProps } from 'react';

const SvgCamera = (props: SVGProps<SVGSVGElement>) => (
  <svg width={14} height={7} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g clipPath='url(#camera_svg__a)' fill='#879596' stroke='#879596' strokeWidth={2}>
      <path d='M13.133 5.384V1.91l-2.606 1.737 2.606 1.737Z' strokeLinejoin='round' />
      <path d='M9.552.87H.867v5.21h8.685V.87Z' strokeMiterlimit={10} />
    </g>
    <defs>
      <clipPath id='camera_svg__a'>
        <path fill='#fff' d='M0 0h14v6.948H0z' />
      </clipPath>
    </defs>
  </svg>
);

export default SvgCamera;
