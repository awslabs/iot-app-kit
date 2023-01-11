import * as React from 'react';
import { SVGProps } from 'react';

const SvgCamera = (props: SVGProps<SVGSVGElement>) => (
  <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' width={16} height={16} {...props}>
    <path d='M15.12 10.2v-4l-3 2 3 2zM1 5h10v6H1z' />
  </svg>
);

export default SvgCamera;
