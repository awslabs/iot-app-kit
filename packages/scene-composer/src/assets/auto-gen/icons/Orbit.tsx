import type { SVGProps } from 'react';
const SvgOrbit = (props: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} {...props}>
    <g fill='none'>
      <path
        stroke='currentColor'
        d='M10.5 8.23c0 4.06-1.14 7.33-2.5 7.33s-2.5-3.35-2.5-7.5S6.62.56 8 .56c1 0 1.87 1.79 2.27 4.35'
      />
      <path fill='currentColor' d='m9.23 8.61 1.21-2.18 1.28 2.14z' />
      <path
        stroke='currentColor'
        d='M7.84 10.56C3.77 10.54.5 9.43.5 8.06s3.36-2.5 7.5-2.5 7.5 1.12 7.5 2.5c0 1-1.78 1.88-4.35 2.27'
      />
      <path fill='currentColor' d='m7.46 9.29 2.17 1.22-2.14 1.27z' />
    </g>
  </svg>
);
export default SvgOrbit;
