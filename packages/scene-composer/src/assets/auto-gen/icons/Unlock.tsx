import * as React from 'react';
import { SVGProps } from 'react';

const SvgUnlock = (props: SVGProps<SVGSVGElement>) => (
  <svg width={14} height={14} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M6.449.91a4.375 4.375 0 0 1 4.784 3.234l-1.693.443a2.625 2.625 0 0 0-5.165.653v.875h7.875c.483 0 .875.392.875.875v6.125a.875.875 0 0 1-.875.875H1.75a.875.875 0 0 1-.875-.875V6.99c0-.483.392-.875.875-.875h.875v-.877A4.375 4.375 0 0 1 6.449.91ZM2.625 7.865v4.375h8.75V7.865h-8.75Z'
      fill='#879596'
    />
  </svg>
);

export default SvgUnlock;
