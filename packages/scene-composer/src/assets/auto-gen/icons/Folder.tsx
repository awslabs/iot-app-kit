import type { SVGProps } from 'react';
const SvgFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} fill='none' {...props}>
    <path
      fill='#879596'
      fillRule='evenodd'
      d='M12.25 13.125H1.75a.874.874 0 0 1-.875-.875V1.75c0-.484.391-.875.875-.875h4.5c.303 0 .585.157.744.415L8.362 3.5h3.888c.484 0 .875.391.875.875v7.875a.874.874 0 0 1-.875.875m-6.487-10.5H2.625v8.75h8.75V5.25h-3.5a.88.88 0 0 1-.745-.415z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgFolder;
