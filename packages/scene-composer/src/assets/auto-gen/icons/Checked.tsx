import * as React from 'react';
import { SVGProps } from 'react';

const SvgChecked = (props: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={12} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='m1.41 5 4.71 4.71 8.29-8.3' stroke='#545B64' />
  </svg>
);

export default SvgChecked;
