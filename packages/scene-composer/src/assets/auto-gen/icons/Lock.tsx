import * as React from 'react';
import { SVGProps } from 'react';

const SvgLock = (props: SVGProps<SVGSVGElement>) => (
  <svg width={14} height={14} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M4.375 5.25a2.625 2.625 0 1 1 5.25 0h-5.25Zm7.875 0h-.875a4.375 4.375 0 1 0-8.75 0H1.75a.875.875 0 0 0-.875.875v6.125c0 .483.392.875.875.875h10.5a.875.875 0 0 0 .875-.875V6.125a.875.875 0 0 0-.875-.875Zm-9.625 6.125V7h8.75v4.375h-8.75Z'
      fill='#879596'
    />
  </svg>
);

export default SvgLock;
