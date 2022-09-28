import * as React from 'react';
import { SVGProps } from 'react';

const SvgPan = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 14 14' {...props}>
    <path
      d='M9.15 1.5a1 1 0 0 1 2 0m-4 0a1 1 0 1 1 2 0m2 2a1 1 0 0 1 2 0v5.9a4.1 4.1 0 0 1-4.1 4.1h-2A4.1 4.1 0 0 1 3.92 12l-2.8-3.34a1.21 1.21 0 0 1 .39-1.84 1.2 1.2 0 0 1 1.19.06l1.42.91h1V2.5a1 1 0 1 1 2 0m4.02 4.28.01-5.28m-2 5.28V1.5m-2 5.28V1.5'
      stroke='currentColor'
      fill='none'
    />
  </svg>
);

export default SvgPan;
